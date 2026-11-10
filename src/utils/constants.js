export const TOPICS = ['Java','C++','C','JavaScript','React','Node.js','Express','MongoDB','SQL','DBMS','Operating Systems','Computer Networks','Linux','OOP','DSA','System Design','HTML','CSS','Angular','Authentication','REST APIs'];
export const ROLES = {
  'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Authentication', 'REST APIs'],
  'Frontend Developer': ['JavaScript', 'React', 'HTML', 'CSS'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL', 'REST APIs', 'Authentication'],
  'Java Developer': ['Java', 'OOP', 'DBMS', 'SQL'],
  'DSA Interview': ['DSA'],
  'Software Engineer': ['OOP', 'DSA', 'DBMS', 'Operating Systems'],
};
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
export const MODES = [
  { id: 'technical', label: 'Technical' }, { id: 'behavioral', label: 'Behavioral' }, { id: 'mixed', label: 'Mixed' },
  { id: 'coding', label: 'Coding' }, { id: 'rapid', label: 'Rapid fire' },
];
export const COUNTS = [5, 10, 15];
export const DURATIONS = [{ v: 0, label: 'Untimed' }, { v: 15, label: '15 min' }, { v: 30, label: '30 min' }, { v: 45, label: '45 min' }];
export const DIMENSIONS = [
  ['technicalAccuracy', 'Technical accuracy'], ['completeness', 'Completeness'], ['clarity', 'Clarity'], ['depth', 'Depth'], ['confidence', 'Confidence*'],
];
export const CONFIDENCE_NOTE = '*AI-estimated communication/confidence score, judged from text only. It is not a measurement of real confidence.';
