import mongoose from "mongoose";

const XPPhaseSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  currentPhase: {
    type: String,
    enum: ['Planning', 'Design', 'Coding', 'Testing', 'Release'],
    default: 'Planning'
  },
  // Specific fields for each phase:
  planning: {
    taskDescription: String,
    priority: { type: String, enum: ['High', 'Medium', 'Low'] },
  },
  design: {
    designNotes: String,  // High-level design overview
  },
  coding: {
    codeReady: { type: Boolean, default: false },
    readyForReview: { type: Boolean, default: false },
    pairProgramming: { type: Boolean, default: false },
  },
  testing: {
    testsPassed: { type: Boolean, default: false },
    testingNotes: String,
  },
  release: {
    releaseDate: Date,
    released: { type: Boolean, default: false },
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const XPPhase = mongoose.model('XPPhase', XPPhaseSchema);
export default XPPhase;
