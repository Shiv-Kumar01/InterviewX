import test from 'node:test';
import assert from 'node:assert/strict';
import { extractJson, normalizeEvaluation, normalizeRoadmap } from '../services/evaluationService.js';
import { runTests } from '../services/codeRunnerService.js';
import { buildReport } from '../services/reportService.js';

test('extractJson recovers JSON wrapped in prose', () => {
  assert.deepEqual(extractJson('Sure! {"score": 7} Hope that helps'), { score: 7 });
  assert.throws(() => extractJson('no json here'));
});

test('normalizeEvaluation clamps scores and rejects malformed output', () => {
  const e = normalizeEvaluation({ score: 15, clarity: -3, strengths: ['a'] }, { answerText: 'one two three four five six' });
  assert.equal(e.aiScore, 100);
  assert.equal(e.scores.clarity, 0);
  assert.throws(() => normalizeEvaluation({ strengths: [] }));
});

test('hybrid scoring blends keyword coverage and caps tiny answers', () => {
  const concepts = ['hash', 'bucket'];
  const good = normalizeEvaluation({ score: 8 }, { expectedConcepts: concepts, answerText: 'A hash map uses a hash function and a bucket array' });
  assert.equal(good.keywordCoverage, 100);
  assert.equal(good.overall, Math.round(80 * 0.7 + 100 * 0.3));
  const tiny = normalizeEvaluation({ score: 10 }, { answerText: 'yes' });
  assert.ok(tiny.overall <= 25);
});

test('normalizeRoadmap keeps at most 7 numbered days', () => {
  const days = normalizeRoadmap({ days: Array.from({ length: 9 }, (_, i) => ({ title: `d${i}`, tasks: ['x'] })) });
  assert.equal(days.length, 7);
  assert.equal(days[6].day, 7);
});

test('sandbox runs correct code, reports wrong code, and stops infinite loops', async () => {
  const q = { functionName: 'add', tests: [{ args: [1, 2], expected: 3 }, { args: [2, 2], expected: 4 }] };
  const ok = await runTests('function add(a,b){return a+b}', q);
  assert.equal(ok.passed, 2);
  const bad = await runTests('function add(a,b){return a*b}', q);
  assert.equal(bad.passed, 1);
  const loop = await runTests('function add(a,b){while(true){}}', q);
  assert.equal(loop.passed, 0);
});

test('buildReport averages answers and finds topic order', () => {
  const mk = (topic, overall) => ({ question: { topic }, timeSpentSec: 30, evaluation: { overall, strengths: ['s'], missingPoints: ['m'], scores: { technicalAccuracy: overall, completeness: overall, clarity: overall, depth: overall, confidence: overall } } });
  const r = buildReport([mk('Java', 90), mk('SQL', 50)], 100);
  assert.equal(r.overall, 70);
  assert.equal(r.byTopic[0].topic, 'Java');
});
