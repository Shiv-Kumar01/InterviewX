import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  role: String,
  difficulty: String,
  topics: [String],
  mode: String,
  questionCount: Number,
  durationMin: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  current: mongoose.Schema.Types.Mixed, // the question currently being asked
  level: { type: Number, default: 0 },  // adaptive difficulty offset (-1, 0, +1)
  askedQuestionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  answeredCount: { type: Number, default: 0 },
  totalSeconds: Number,
  completedAt: Date,
  report: mongoose.Schema.Types.Mixed,
}, { timestamps: true });
interviewSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Interview', interviewSchema);
