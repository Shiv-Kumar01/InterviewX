// Hand-written sample data used by /demo. It is NOT produced by the AI and is always labelled "Demo Data".
const ev = (overall, strengths, missingPoints) => ({ overall, scores: { technicalAccuracy: overall, completeness: overall - 6, clarity: overall + 4, depth: overall - 8, confidence: overall - 5 }, strengths, missingPoints });

export const demoAnswers = [
  { order: 1, question: { text: 'What is the difference between authentication and authorization?', topic: 'Authentication', difficulty: 'Medium' }, answerText: 'Authentication verifies who you are, authorization decides what you can access.', evaluation: ev(84, ['Clear distinction'], ['Role-based access example']) },
  { order: 2, question: { text: 'How does JWT authentication work and what are its weaknesses?', topic: 'Authentication', difficulty: 'Medium', isFollowUp: true }, answerText: 'The server signs a token with a secret and the client sends it on every request.', evaluation: ev(68, ['Explained signing'], ['Token expiry', 'Refresh tokens']) },
  { order: 3, question: { text: 'Explain useEffect, its dependency array and cleanup functions.', topic: 'React', difficulty: 'Medium' }, answerText: 'useEffect runs side effects after render. The dependency array controls when it re-runs.', evaluation: ev(79, ['Good dependency array explanation'], ['Cleanup function example']) },
  { order: 4, question: { text: 'When would you embed documents versus reference them in MongoDB?', topic: 'MongoDB', difficulty: 'Medium' }, answerText: 'Embed when data is read together, reference when it grows without bound.', evaluation: ev(88, ['Accurate trade-off'], []) },
];

export const demoReport = {
  overall: 80,
  dimensions: { technicalAccuracy: 80, completeness: 74, clarity: 84, depth: 72, confidence: 75 },
  byTopic: [{ topic: 'MongoDB', score: 88, count: 1 }, { topic: 'Authentication', score: 76, count: 2 }, { topic: 'React', score: 79, count: 1 }],
  skills: [{ skill: 'Java', score: 0 }, { skill: 'DSA', score: 0 }, { skill: 'React', score: 79 }, { skill: 'Backend', score: 76 }, { skill: 'DBMS', score: 88 }, { skill: 'Communication', score: 84 }, { skill: 'Problem Solving', score: 72 }],
  questionsAnswered: 4, totalSeconds: 612, avgSecondsPerQuestion: 140,
  feedback: { summary: 'Solid fundamentals with strong database reasoning. Authentication answers lost points for missing token lifecycle details.', wentWell: ['Clear authentication vs authorization distinction', 'Accurate MongoDB schema trade-offs'], missed: ['JWT expiry and refresh tokens', 'useEffect cleanup'], improvement: 'Practise the full JWT lifecycle, including refresh tokens.' },
  roadmap: [
    { day: 1, title: 'JWT and authentication', tasks: ['Review JWT structure', 'Explain refresh tokens out loud'] },
    { day: 2, title: 'Authorization middleware', tasks: ['Write a role-check middleware', 'Answer 3 questions on RBAC'] },
    { day: 3, title: 'REST API design', tasks: ['Review HTTP methods and status codes', 'Design a small API'] },
    { day: 4, title: 'MongoDB modelling', tasks: ['Embed vs reference practice', 'Index basics'] },
    { day: 5, title: 'DSA: HashMaps', tasks: ['Solve Two Sum', 'Explain collisions'] },
    { day: 6, title: 'React interview questions', tasks: ['useEffect cleanup', 'Keys and reconciliation'] },
    { day: 7, title: 'Full mock interview', tasks: ['Take a mixed interview', 'Compare with this score'] },
  ],
};

export const demoAnalytics = {
  totalInterviews: 4, averageScore: 76, bestScore: 84, questionsAnswered: 28, averageResponseSec: 96, streak: 3, readiness: 80,
  strongest: { topic: 'MongoDB' }, weakest: { topic: 'DSA' },
  trend: [{ label: '#1', score: 68 }, { label: '#2', score: 73 }, { label: '#3', score: 79 }, { label: '#4', score: 84 }],
  topics: [{ topic: 'MongoDB', score: 88 }, { topic: 'React', score: 80 }, { topic: 'Authentication', score: 76 }, { topic: 'DSA', score: 62 }],
};
