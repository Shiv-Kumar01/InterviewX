import Interview from '../models/Interview.js';
import Answer from '../models/Answer.js';
import { topicScores, skillRadar } from './reportService.js';

const avg = (a) => (a.length ? Math.round(a.reduce((s, x) => s + x, 0) / a.length) : 0);
const dayKey = (d) => new Date(d).toISOString().slice(0, 10);

function streak(dates) {
  const days = new Set(dates.map(dayKey));
  const d = new Date();
  if (!days.has(dayKey(d))) d.setUTCDate(d.getUTCDate() - 1); // today is optional
  let n = 0;
  while (days.has(dayKey(d))) { n++; d.setUTCDate(d.getUTCDate() - 1); }
  return n;
}

async function load(userId) {
  const interviews = await Interview.find({ user: userId, status: 'completed' }).sort({ completedAt: 1 }).lean();
  const answers = await Answer.find({ user: userId, interview: { $in: interviews.map((i) => i._id) } }).lean();
  return { interviews, answers };
}

export async function getAnalytics(userId) {
  const { interviews, answers } = await load(userId);
  const scores = interviews.map((i) => i.report.overall);
  const topics = topicScores(answers);
  const dimKeys = ['technicalAccuracy', 'completeness', 'clarity', 'depth', 'confidence'];
  return {
    totalInterviews: interviews.length,
    averageScore: avg(scores),
    bestScore: scores.length ? Math.max(...scores) : 0,
    questionsAnswered: answers.length,
    averageResponseSec: avg(answers.map((a) => a.timeSpentSec || 0)),
    streak: streak(interviews.map((i) => i.completedAt)),
    readiness: avg(scores.slice(-3)),
    dimensions: Object.fromEntries(dimKeys.map((k) => [k, avg(interviews.map((i) => i.report.dimensions[k]))])),
    topics,
    strongest: topics[0] || null,
    weakest: topics.length > 1 ? topics.at(-1) : null,
    trend: interviews.map((i, n) => ({ id: i._id, label: `#${n + 1}`, score: i.report.overall, title: i.title, date: i.completedAt })),
    recent: interviews.slice(-5).reverse().map((i) => ({ id: i._id, title: i.title, score: i.report.overall, date: i.completedAt })),
  };
}

export async function getSkills(userId) {
  const { answers } = await load(userId);
  return skillRadar(answers);
}
