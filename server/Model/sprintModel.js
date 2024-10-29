import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
});

const Sprint = mongoose.model("Sprint", sprintSchema);
export default Sprint;
