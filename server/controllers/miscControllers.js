import Question from '../models/Question.js';
import Roadmap from '../models/Roadmap.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { TOPICS, DIFFICULTIES } from '../utils/constants.js';
import { getAnalytics, getSkills } from '../services/analyticsService.js';
import { runTests } from '../services/codeRunnerService.js';

export const listQuestions = asyncHandler(async (req, res) => {
  const { topic, difficulty, type } = req.query;
  const filter = { $or: [{ createdBy: { $exists: false } }, { createdBy: req.user._id }] };
  if (topic) filter.topic = String(topic);
  if (DIFFICULTIES.includes(difficulty)) filter.difficulty = difficulty;
  if (['technical', 'behavioral', 'coding'].includes(type)) filter.type = type;
  const questions = await Question.find(filter).select('text topic type difficulty expectedConcepts createdBy').limit(200).lean();
  res.json({ questions });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const { text, topic, difficulty, type = 'technical' } = req.body;
  const concepts = Array.isArray(req.body.expectedConcepts) ? req.body.expectedConcepts.map(String).slice(0, 10) : [];
  if (typeof text !== 'string' || text.trim().length < 15) throw new AppError('Question text must be at least 15 characters.', 400);
  if (![...TOPICS, 'Behavioral'].includes(topic)) throw new AppError('Unknown topic.', 400);
  if (!DIFFICULTIES.includes(difficulty)) throw new AppError('Invalid difficulty.', 400);
  if (!['technical', 'behavioral'].includes(type)) throw new AppError('Only technical and behavioral questions can be added.', 400);
  const q = await Question.create({ text: text.trim(), topic, difficulty, type, expectedConcepts: concepts, createdBy: req.user._id });
  res.status(201).json({ question: q });
});

export const analytics = asyncHandler(async (req, res) => res.json(await getAnalytics(req.user._id)));
export const skills = asyncHandler(async (req, res) => res.json({ skills: await getSkills(req.user._id) }));
export const latestRoadmap = asyncHandler(async (req, res) =>
  res.json({ roadmap: await Roadmap.findOne({ user: req.user._id }).sort({ createdAt: -1 }).lean() }));

export const runCode = asyncHandler(async (req, res) => {
  const code = String(req.body.code ?? '').slice(0, 10000);
  const q = await Question.findOne({ _id: req.body.questionId, type: 'coding' }).catch(() => null);
  if (!q) throw new AppError('Coding question not found.', 404);
  if (!code.trim()) throw new AppError('Write some code first.', 400);
  res.json(await runTests(code, q));
});
