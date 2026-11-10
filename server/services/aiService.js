import { config } from '../config/env.js';
import AppError from '../utils/AppError.js';
import * as prompts from './promptService.js';
import * as ev from './evaluationService.js';

// The only file that talks to Ollama. The browser never calls it directly.
async function chat(system, user, { json = true } = {}) {
  if (!config.ollamaModel) throw new AppError('No AI model configured. Set OLLAMA_MODEL in .env (use a model you have pulled with Ollama).', 503);
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), config.ollamaTimeoutMs);
  try {
    const res = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal,
      body: JSON.stringify({
        model: config.ollamaModel, stream: false, ...(json && { format: 'json' }),
        options: { temperature: 0.3 }, messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
    });
    if (res.status === 404) throw new AppError(`Model "${config.ollamaModel}" not found. Run: ollama pull ${config.ollamaModel}`, 503);
    if (!res.ok) throw new AppError('The AI service returned an error.', 502);
    return (await res.json()).message?.content ?? '';
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err.name === 'AbortError') throw new AppError('The AI took too long to respond. Try again or use a smaller model.', 504);
    throw new AppError('AI service unavailable. Make sure Ollama is running locally.', 503);
  } finally {
    clearTimeout(timer);
  }
}

// Ask for JSON, validate it, and retry once if the model returns something malformed.
async function structured({ system, user }, normalize) {
  let lastErr;
  for (let attempt = 0; attempt < 2; attempt++) {
    const text = await chat(system, user);
    try { return normalize(ev.extractJson(text)); } catch (e) { lastErr = e; }
  }
  console.error('Malformed AI response:', lastErr?.message);
  throw new AppError('The AI returned an unreadable response. Please try again.', 502);
}

export const evaluateAnswer = (ctx) =>
  structured(prompts.evaluationPrompt(ctx), (raw) =>
    ev.normalizeEvaluation(raw, { expectedConcepts: ctx.concepts, answerText: ctx.answerText || '', code: ctx.code || '', testResults: ctx.testResults }));

export const generateFinalFeedback = (ctx) => structured(prompts.finalFeedbackPrompt(ctx), ev.normalizeFeedback);
export const generateRoadmap = (ctx) => structured(prompts.roadmapPrompt(ctx), ev.normalizeRoadmap);
export const generateQuestion = (ctx) => structured(prompts.questionPrompt(ctx), ev.normalizeQuestion);

export async function pingOllama() {
  try {
    const res = await fetch(`${config.ollamaBaseUrl}/api/tags`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch { return false; }
}
