import Question from '../models/Question.js';
import * as ai from './aiService.js';

const ORDER = ['Easy', 'Medium', 'Hard'];
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

const toCurrent = (q) => ({
  questionId: q._id, text: q.text, topic: q.topic, difficulty: q.difficulty, type: q.type,
  expectedConcepts: q.expectedConcepts || [], isFollowUp: false, starterCode: q.starterCode, visualizer: q.visualizer,
});

// The answer key (expectedConcepts) stays on the server.
export const publicQuestion = (c) => (c ? { ...c, expectedConcepts: undefined } : c);
export const publicInterview = (iv) => ({ ...iv.toObject(), current: publicQuestion(iv.current) });

// Picks the next bank question: rotates through chosen topics, shifts difficulty with `level`.
export async function pickQuestion(iv, level = 0) {
  const n = iv.answeredCount || 0;
  const type = iv.mode === 'behavioral' ? 'behavioral' : iv.mode === 'coding' ? 'coding'
    : iv.mode === 'mixed' && n % 3 === 2 ? 'behavioral' : 'technical';
  const base = { type, _id: { $nin: iv.askedQuestionIds || [] }, $or: [{ createdBy: { $exists: false } }, { createdBy: iv.user }] };
  const topics = type === 'technical' ? iv.topics : [];
  const want = ORDER[clamp(ORDER.indexOf(iv.difficulty) + level, 0, 2)];
  const attempts = topics.length
    ? [{ ...base, topic: topics[n % topics.length], difficulty: want }, { ...base, topic: { $in: topics }, difficulty: want }, { ...base, topic: { $in: topics } }]
    : [{ ...base, difficulty: want }, base];
  for (const match of attempts) {
    const [q] = await Question.aggregate([{ $match: match }, { $sample: { size: 1 } }]);
    if (q) return toCurrent(q);
  }
  return null;
}

// ADAPTIVE LOGIC: strong answer -> harder; weak answer -> easier; non-strong -> probe with the AI follow-up.
export async function chooseNext(iv, evaluation, current) {
  const delta = evaluation.overall >= 80 ? 1 : evaluation.overall < 50 ? -1 : 0;
  iv.level = clamp((iv.level || 0) + delta, -1, 1);

  const canProbe = iv.mode !== 'rapid' && current.type !== 'coding' && !current.isFollowUp;
  if (canProbe && evaluation.followUpQuestion && evaluation.overall < 80) {
    return { text: evaluation.followUpQuestion, topic: current.topic, difficulty: current.difficulty, type: current.type, expectedConcepts: [], isFollowUp: true };
  }
  const fromBank = await pickQuestion(iv, iv.level);
  if (fromBank) return fromBank;
  try { // bank exhausted: let the AI write a question
    const topic = iv.topics[0] || current.topic;
    const g = await ai.generateQuestion({ role: iv.role, topic, difficulty: iv.difficulty, asked: [current.text] });
    return { text: g.question, topic, difficulty: iv.difficulty, type: 'technical', expectedConcepts: g.concepts, isFollowUp: false };
  } catch { return null; }
}
