import Question from '../models/Question.js';
import { questions, codingQuestions } from '../data/questions.js';

// Seeds the global question bank once, so a fresh install works immediately.
export async function seedIfEmpty() {
  if ((await Question.countDocuments()) > 0) return;
  await Question.insertMany([...questions, ...codingQuestions]);
  console.log(`Seeded ${questions.length + codingQuestions.length} questions`);
}
