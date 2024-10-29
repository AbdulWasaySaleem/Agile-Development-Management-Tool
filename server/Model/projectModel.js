import mongoose from "mongoose";
import Task from "./taskModel.js";
import userModel from "./userModel.js";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["not started", "in progress", "completed"],
    default: "not started",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel, // Assuming you have a User model
    },
  ],
  methodology: {
    type: String,
    enum: ["Kanban", "Scrum", "XP"],
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Task, // Reference to the Task model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

const Project = mongoose.model("projects", projectSchema);

export default Project;
