const avg = (a) => (a.length ? Math.round(a.reduce((s, x) => s + x, 0) / a.length) : 0);
const uniq = (a) => [...new Set(a)];

// Maps individual topics onto the radar chart axes.
export const RADAR_GROUPS = {
  Java: ['Java', 'OOP', 'C++', 'C'],
  DSA: ['DSA'],
  React: ['React', 'JavaScript', 'HTML', 'CSS', 'Angular'],
  Backend: ['Node.js', 'Express', 'Authentication', 'REST APIs', 'Linux', 'Operating Systems', 'Computer Networks'],
  DBMS: ['MongoDB', 'SQL', 'DBMS'],
};

export function skillRadar(answers) {
  const axes = Object.entries(RADAR_GROUPS).map(([skill, topics]) => {
    const s = answers.filter((a) => topics.includes(a.question.topic)).map((a) => a.evaluation.overall);
    return { skill, score: avg(s), count: s.length };
  });
  axes.push({ skill: 'Communication', score: avg(answers.map((a) => a.evaluation.scores.clarity)), count: answers.length });
  axes.push({ skill: 'Problem Solving', score: avg(answers.map((a) => a.evaluation.scores.depth)), count: answers.length });
  return axes;
}

export function topicScores(answers) {
  const map = {};
  answers.forEach((a) => (map[a.question.topic] ??= []).push(a.evaluation.overall));
  return Object.entries(map).map(([topic, s]) => ({ topic, score: avg(s), count: s.length })).sort((a, b) => b.score - a.score);
}

export function buildReport(answers, totalSeconds) {
  const dim = (k) => avg(answers.map((a) => a.evaluation.scores[k]));
  const sorted = [...answers].sort((a, b) => b.evaluation.overall - a.evaluation.overall);
  return {
    overall: avg(answers.map((a) => a.evaluation.overall)),
    dimensions: { technicalAccuracy: dim('technicalAccuracy'), completeness: dim('completeness'), clarity: dim('clarity'), depth: dim('depth'), confidence: dim('confidence') },
    byTopic: topicScores(answers),
    skills: skillRadar(answers),
    questionsAnswered: answers.length,
    totalSeconds,
    avgSecondsPerQuestion: avg(answers.map((a) => a.timeSpentSec || 0)),
    strengths: uniq(sorted.slice(0, 3).flatMap((a) => a.evaluation.strengths)).slice(0, 6),
    missed: uniq([...sorted].reverse().slice(0, 3).flatMap((a) => a.evaluation.missingPoints)).slice(0, 6),
  };
}

export function fallbackFeedback(report) {
  const best = report.byTopic[0]?.topic, worst = report.byTopic.at(-1)?.topic;
  return {
    summary: `You scored ${report.overall}/100 across ${report.questionsAnswered} questions. Strongest topic: ${best}. Weakest topic: ${worst}.`,
    wentWell: report.strengths.slice(0, 4), missed: report.missed.slice(0, 4),
    improvement: `Spend extra time on ${worst} and re-attempt the questions you missed.`,
  };
}

export function fallbackRoadmap(weakTopics) {
  const topics = weakTopics.length ? weakTopics : ['Core fundamentals'];
  const days = Array.from({ length: 6 }, (_, i) => {
    const t = topics[i % topics.length];
    return { day: i + 1, title: i % 2 ? `Practice questions: ${t}` : `Revise concepts: ${t}`, tasks: [`Review the core ideas of ${t}`, `Answer 3 practice questions on ${t} out loud`] };
  });
  days.push({ day: 7, title: 'Full mock interview', tasks: ['Take a full mixed interview', 'Compare the score with your last attempt'] });
  return days;
}
