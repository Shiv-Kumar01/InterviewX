import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  topic: { type: String, required: true },
  type: { type: String, enum: ['technical', 'behavioral', 'coding'], required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  expectedConcepts: [String], // the "answer key": used for keyword coverage in hybrid scoring
  functionName: String,       // coding only
  starterCode: { javascript: String, java: String },
  tests: [{ _id: false, args: mongoose.Schema.Types.Mixed, expected: mongoose.Schema.Types.Mixed }],
  visualizer: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // absent = global question
});
questionSchema.index({ type: 1, topic: 1, difficulty: 1 });

export default mongoose.model('Question', questionSchema);
