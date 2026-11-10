// Validates AI output and combines it with deterministic checks (hybrid scoring).
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : null; };
const strs = (a, max = 5) => (Array.isArray(a) ? a.map((x) => String(x).trim()).filter(Boolean).slice(0, max) : []);

export function extractJson(text) {
  try { return JSON.parse(text); } catch { /* fall through: model may wrap JSON in prose */ }
  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  if (s >= 0 && e > s) return JSON.parse(text.slice(s, e + 1));
  throw new Error('No JSON found in AI response');
}

export function normalizeEvaluation(raw, { expectedConcepts = [], answerText = '', code = '', testResults = null } = {}) {
  if (!raw || typeof raw !== 'object') throw new Error('AI response is not an object');
  const score = num(raw.score);
  if (score === null) throw new Error('AI response is missing a score');

  const dim = (v) => Math.round(clamp(num(v) ?? score, 0, 10) * 10);
  const scores = {
    technicalAccuracy: dim(raw.technicalAccuracy), completeness: dim(raw.completeness),
    clarity: dim(raw.clarity), depth: dim(raw.depth), confidence: dim(raw.confidence),
  };
  const aiScore = Math.round(clamp(score, 0, 10) * 10);

  // Deterministic signal 1: keyword coverage of expected concepts (theory answers).
  const text = answerText.toLowerCase();
  const hit = code ? [] : expectedConcepts.filter((c) => text.includes(c.toLowerCase()));
  const keywordCoverage = !code && expectedConcepts.length ? Math.round((hit.length / expectedConcepts.length) * 100) : null;
  // Deterministic signal 2: automated test pass rate (coding answers).
  const testRate = testResults?.total ? Math.round((testResults.passed / testResults.total) * 100) : null;

  let overall = aiScore;
  if (testRate !== null) overall = Math.round(aiScore * 0.4 + testRate * 0.6);
  else if (keywordCoverage !== null) overall = Math.round(aiScore * 0.7 + keywordCoverage * 0.3);

  const words = answerText.trim().split(/\s+/).filter(Boolean).length;
  if (!code.trim() && words < 5) overall = Math.min(overall, 25); // guard against generous models

  const missingPoints = strs(raw.missingPoints);
  if (!missingPoints.length && keywordCoverage !== null && keywordCoverage < 100) {
    const missing = expectedConcepts.filter((c) => !hit.includes(c)).slice(0, 3);
    if (missing.length) missingPoints.push(`Did not mention: ${missing.join(', ')}`);
  }

  return {
    overall, aiScore, scores, keywordCoverage, testRate,
    strengths: strs(raw.strengths), missingPoints,
    improvement: String(raw.improvement || '').slice(0, 300),
    followUpQuestion: String(raw.followUpQuestion || '').trim().slice(0, 300),
    timeComplexity: String(raw.timeComplexity || '').slice(0, 40),
    spaceComplexity: String(raw.spaceComplexity || '').slice(0, 40),
  };
}

export function normalizeFeedback(raw) {
  if (!raw || typeof raw.summary !== 'string') throw new Error('Feedback missing summary');
  return { summary: raw.summary.slice(0, 500), wentWell: strs(raw.wentWell, 4), missed: strs(raw.missed, 4), improvement: String(raw.improvement || '').slice(0, 300) };
}

export function normalizeRoadmap(raw) {
  if (!Array.isArray(raw?.days) || raw.days.length < 3) throw new Error('Roadmap needs days');
  return raw.days.slice(0, 7).map((d, i) => ({ day: i + 1, title: String(d.title || `Day ${i + 1}`).slice(0, 80), tasks: strs(d.tasks, 4) }));
}

export function normalizeQuestion(raw) {
  if (typeof raw?.question !== 'string' || raw.question.length < 10) throw new Error('Question missing');
  return { question: raw.question.trim().slice(0, 400), concepts: strs(raw.concepts, 6) };
}
