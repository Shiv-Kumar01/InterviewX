import Interview from '../models/Interview.js';
import Answer from '../models/Answer.js';
import Question from '../models/Question.js';
import Roadmap from '../models/Roadmap.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { TOPICS, DIFFICULTIES, MODES, DURATIONS } from '../utils/constants.js';
import * as ai from '../services/aiService.js';
import { runTests } from '../services/codeRunnerService.js';
import { pickQuestion, chooseNext, publicQuestion, publicInterview } from '../services/interviewService.js';
import { buildReport, fallbackFeedback, fallbackRoadmap } from '../services/reportService.js';

const findOwned = async (req) => {
  const iv = await Interview.findOne({ _id: req.params.id, user: req.user._id }).catch(() => null);
  if (!iv) throw new AppError('Interview not found.', 404);
  return iv;
};

export const createInterview = asyncHandler(async (req, res) => {
  const { role = 'Software Engineer', difficulty = 'Medium', mode = 'technical', questionCount = 5, durationMin = 0 } = req.body;
  const topics = Array.isArray(req.body.topics) ? req.body.topics.filter((t) => TOPICS.includes(t)) : [];
  const needsTopics = ['technical', 'mixed', 'rapid'].includes(mode);

  if (!MODES.includes(mode)) throw new AppError('Invalid interview mode.', 400);
  if (!DIFFICULTIES.includes(difficulty)) throw new AppError('Invalid difficulty.', 400);
  if (!DURATIONS.includes(Number(durationMin))) throw new AppError('Invalid time limit.', 400);
  if (!Number.isInteger(questionCount) || questionCount < 1 || questionCount > 20) throw new AppError('Question count must be between 1 and 20.', 400);
  if (needsTopics && !topics.length) throw new AppError('Choose at least one topic.', 400);

  const iv = new Interview({
    user: req.user._id, role: String(role).slice(0, 60), difficulty, mode, questionCount, durationMin: Number(durationMin),
    topics: needsTopics ? topics : [], title: `${String(role).slice(0, 60)} - ${mode}`,
  });
  const first = await pickQuestion(iv);
  if (!first) throw new AppError('No questions match this setup yet. Try different topics or another mode.', 404);
  iv.current = first;
  iv.askedQuestionIds.push(first.questionId);
  await iv.save();
  res.status(201).json({ interview: publicInterview(iv) });
});

export const listInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100)
    .select('title mode difficulty status createdAt answeredCount questionCount report.overall').lean();
  res.json({ interviews });
});

export const getInterview = asyncHandler(async (req, res) => {
  const iv = await findOwned(req);
  const answers = await Answer.find({ interview: iv._id }).sort({ order: 1 }).lean();
  res.json({ interview: publicInterview(iv), answers });
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const iv = await findOwned(req);
  if (iv.status !== 'active') throw new AppError('This interview is already finished.', 409);

  const q = iv.current;
  const answerText = String(req.body.answerText ?? '').trim().slice(0, 6000);
  const code = String(req.body.code ?? '').slice(0, 10000);
  const language = req.body.language === 'java' ? 'java' : 'javascript';
  const timeSpentSec = Math.max(0, Math.min(Number(req.body.timeSpentSec) || 0, 7200));
  if (q.type === 'coding' ? !code.trim() : !answerText) throw new AppError(q.type === 'coding' ? 'Write some code before submitting.' : 'Please write an answer before submitting.', 400);

  // Tests are re-run server-side so results can't be faked by the client.
  let testResults = null;
  if (q.type === 'coding' && language === 'javascript' && q.questionId) {
    const qDoc = await Question.findById(q.questionId);
    if (qDoc?.tests?.length) testResults = await runTests(code, qDoc);
  }

  // If Ollama is down this throws before anything is saved, so the user can simply retry.
  const evaluation = await ai.evaluateAnswer({
    role: iv.role, mode: iv.mode, difficulty: q.difficulty, question: q.text, concepts: q.expectedConcepts,
    answerText, code: q.type === 'coding' ? code : '', language, testResults,
    testSummary: testResults && (testResults.error || `${testResults.passed} of ${testResults.total} passed`),
  });

  await Answer.create({
    interview: iv._id, user: req.user._id, order: iv.answeredCount + 1,
    question: { text: q.text, topic: q.topic, difficulty: q.difficulty, type: q.type, isFollowUp: !!q.isFollowUp },
    answerText, code: q.type === 'coding' ? code : undefined, language: q.type === 'coding' ? language : undefined,
    timeSpentSec, testResults, evaluation,
  });

  iv.answeredCount += 1;
  let next = null;
  if (iv.answeredCount < iv.questionCount) {
    next = await chooseNext(iv, evaluation, q);
    if (next?.questionId) iv.askedQuestionIds.push(next.questionId);
  }
  iv.current = next || q;
  await iv.save();
  res.json({ evaluation, testResults, next: publicQuestion(next), answeredCount: iv.answeredCount, done: !next });
});

export const finishInterview = asyncHandler(async (req, res) => {
  const iv = await findOwned(req);
  if (iv.status === 'completed') return res.json({ report: iv.report });

  const answers = await Answer.find({ interview: iv._id }).sort({ order: 1 }).lean();
  if (!answers.length) throw new AppError('Answer at least one question before finishing.', 400);

  const sumSeconds = answers.reduce((s, a) => s + (a.timeSpentSec || 0), 0);
  const totalSeconds = Math.max(sumSeconds, Math.min(Number(req.body.totalSeconds) || 0, 14400));
  const report = buildReport(answers, totalSeconds);

  // AI writes the feedback and roadmap; deterministic fallbacks keep the report usable if it fails.
  const weakTopics = report.byTopic.filter((t) => t.score < 70).map((t) => t.topic).reverse().slice(0, 4);
  const lines = answers.map((a) => `- [${a.question.topic}] score ${a.evaluation.overall}; missed: ${a.evaluation.missingPoints.join(', ') || 'nothing notable'}`);
  try { report.feedback = { ...(await ai.generateFinalFeedback({ role: iv.role, overall: report.overall, lines })), source: 'ai' }; }
  catch { report.feedback = { ...fallbackFeedback(report), source: 'fallback' }; }
  let days, source = 'ai';
  try { days = await ai.generateRoadmap({ role: iv.role, weakTopics, missed: report.missed }); }
  catch { days = fallbackRoadmap(weakTopics); source = 'fallback'; }
  report.roadmap = days;

  await Roadmap.create({ user: req.user._id, interview: iv._id, focusTopics: weakTopics, source, days });
  iv.report = report; iv.status = 'completed'; iv.completedAt = new Date(); iv.totalSeconds = totalSeconds;
  await iv.save();
  res.json({ report });
});
