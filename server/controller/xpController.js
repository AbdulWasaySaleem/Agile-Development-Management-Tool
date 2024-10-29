import { request } from "express";
import Project from "../Model/projectModel.js";
import Task from "../Model/taskModel.js";
import XPPhase from "../Model/xpModel.js";

export const postXp = async (req, res) => {
  try {
    const {
      projectId,
      taskId,
      currentPhase,
      priority,
      description,
      designNotes,
    } = req.body;

    // Check if project and task exist
    const project = await Project.findById(projectId);
    const task = await Task.findById(taskId);

    if (!project || !task) {
      return res.status(404).json({ message: "Project or Task not found" });
    }

    // Create a new XPPhase document
    const xpPhase = new XPPhase({
      projectId,
      taskId,
      currentPhase,
      planning: {
        taskDescription: description || "",
        priority: priority || "Low",
      },
      design: {
        designNotes: designNotes || "",
      },
      status: "To Do",
    });

    await xpPhase.save();

    //console.log("xpPhase", xpPhase);

    res
      .status(201)
      .json({ message: "XP Phase created successfully", data: xpPhase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getXp = async (req, res) => {
  try {
    const { projectId } = req.params;
    const xpPhases = await XPPhase.find({ projectId });

    res.status(200).json({ xpPhases, message: "all tasks fetched" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const patchPhases = async (req, res) => {
  const { id } = req.params;
  const { currentPhase } = req.body; // Expecting { currentPhase: "Design" }

  try {
    // Find the XPPhase by ID and update the currentPhase
    const updatedXPPhase = await XPPhase.findByIdAndUpdate(
      id,
      { currentPhase },
      { new: true, runValidators: true }
    );

    if (!updatedXPPhase) {
      return res.status(404).json({ message: "XP Phase not found" });
    }

    res
      .status(200)
      .json({ message: "XP Phase updated successfully", updatedXPPhase });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update XP Phase", error: error.message });
  }
};

export const patchCodeFields = async (req, res) => {
  const { id } = req.params;
  const { codeReady, readyForReview, pairProgramming } = req.body;

  try {
    const updatedXPPhase = await XPPhase.findByIdAndUpdate(
      id,
      { coding: { codeReady, readyForReview, pairProgramming } },
      { new: true, runValidators: true }
    );

    if (!updatedXPPhase) {
      return res.status(404).json({ message: "XP Phase not found" });
    }

    res
      .status(200)
      .json({ message: "XP Phase updated successfully", updatedXPPhase });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update XP Phase", error: error.message });
  }
};

export const patchTestFields = async (req, res) => {
  try {
    const updatedXPPhase = await XPPhase.findByIdAndUpdate(
      req.params.id,
      { $set: { "testing.testsPassed": req.body.testsPassed } }, // Use dot notation to specify the nested field
      { new: true }
    );

    console.log("Updated XP Phase:", updatedXPPhase); // Log updated phase
    return res.status(200).json({
      success: true,
      message: "Testing fields updated successfully",
      xpPhase: updatedXPPhase,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update XP test", error: error.message });
  }
};

export const patchReleaseFields = async (req, res) => {
  try {
    const updatedXPPhase = await XPPhase.findByIdAndUpdate(
      req.params.id,
      { $set: { "release.released": req.body.released } },
      { new: true }
    );

    if (!updatedXPPhase) {
      return res
        .status(404)
        .json({ success: false, message: "XP Phase not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Release fields updated successfully",
      xpPhase: updatedXPPhase,
    });
  } catch (error) {
    console.error("Error updating release fields:", error); // Log the error
    return res
      .status(500)
      .json({ success: false, message: "Failed to update release fields" });
  }
};
