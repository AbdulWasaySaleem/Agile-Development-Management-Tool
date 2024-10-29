import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    methodology: {
      type: String,
      enum: ["Kanban", "Scrum", "XP"],
      required: true,
    },
    sprint: { type: mongoose.Schema.Types.ObjectId, ref: "Sprint" }, // Only for Scrum
    xpPhase: { type: mongoose.Schema.Types.ObjectId, ref: "Xp" },
    currentPhase: { type: String, enum: ['','Planning', 'Design', 'Coding', 'Testing', 'Release'], default: '' },
 
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
