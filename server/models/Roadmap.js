import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
  focusTopics: [String],
  source: String, // 'ai' or 'fallback'
  days: [{ _id: false, day: Number, title: String, tasks: [String] }],
}, { timestamps: true });
roadmapSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Roadmap', roadmapSchema);
