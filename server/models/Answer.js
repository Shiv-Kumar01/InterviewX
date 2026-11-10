import mongoose from 'mongoose';

// One document per answered question. Kept separate from Interview so interviews stay small.
const answerSchema = new mongoose.Schema({
  interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  order: Number,
  question: { text: String, topic: String, difficulty: String, type: { type: String }, isFollowUp: Boolean },
  answerText: String,
  code: String,
  language: String,
  timeSpentSec: Number,
  testResults: mongoose.Schema.Types.Mixed,
  evaluation: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export default mongoose.model('Answer', answerSchema);
