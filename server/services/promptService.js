// All prompt text lives here, so behaviour can be tuned without touching logic.
const JSON_ONLY = 'Respond with ONLY a valid JSON object. No markdown, no commentary.';

export function evaluationPrompt({ role, mode, difficulty, question, concepts, answerText, code, language, testSummary }) {
  const system = `You are a strict but fair senior technical interviewer. ${JSON_ONLY}
Keys: score, technicalAccuracy, completeness, clarity, depth, confidence (all numbers 0-10), strengths (array of short strings), missingPoints (array of short strings), improvement (one sentence), followUpQuestion (one natural follow-up question that probes a gap or goes deeper), timeComplexity and spaceComplexity (strings like "O(n)", only for code answers, otherwise empty strings).
"confidence" is an estimate of how clearly and assertively the answer is expressed, judged from text only.
Be strict: vague, very short or incorrect answers must score below 5. ${mode === 'rapid' ? 'This is rapid fire: short answers are acceptable if correct.' : ''}`;
  const user = `Role: ${role}\nDifficulty: ${difficulty}\nQuestion: ${question}
${concepts?.length ? `Concepts a strong answer usually covers (hint only): ${concepts.join(', ')}\n` : ''}Candidate answer: ${answerText || '(none)'}
${code ? `Candidate code (${language}):\n${code}\n${testSummary ? `Automated tests: ${testSummary}\n` : ''}` : ''}`;
  return { system, user };
}

export function finalFeedbackPrompt({ role, overall, lines }) {
  return {
    system: `You are an interview coach. ${JSON_ONLY} Keys: summary (2 sentences), wentWell (array of up to 4 short strings), missed (array of up to 4 short strings), improvement (one sentence).`,
    user: `Role: ${role}. Overall score: ${overall}/100.\nPer-question results:\n${lines.join('\n')}`,
  };
}

export function roadmapPrompt({ role, weakTopics, missed }) {
  return {
    system: `You are an interview coach. ${JSON_ONLY} Key: days (array of exactly 7 objects with day (1-7), title (short), tasks (array of 2-3 short actionable strings)). Day 7 must be a full mock interview.`,
    user: `Role: ${role}. Weakest topics: ${weakTopics.join(', ') || 'general'}. Missed points: ${missed.join('; ') || 'none recorded'}.`,
  };
}

export function questionPrompt({ role, topic, difficulty, asked }) {
  return {
    system: `You are a technical interviewer. ${JSON_ONLY} Keys: question (string), concepts (array of 3-5 keywords a good answer mentions).`,
    user: `Role: ${role}. Topic: ${topic}. Difficulty: ${difficulty}. Do not repeat: ${asked.join(' | ') || 'n/a'}.`,
  };
}
