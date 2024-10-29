import express from "express";
import {
  addnewTask,
  addTasks,
  createSprint,
  deleteTask,
  getTasks,
  getTasksOfProject,
  getTasksSprints,
  patchSprint,
  patchTask,
  updateTask,
  updateTaskPhase,
} from "../controller/taskController.js";

const router = express.Router();

router.post("/addtask", addTasks);

router.post("/add-new-task", addnewTask);
router.get("/alltask", getTasks);
router.delete("/deleteTask/:id", deleteTask);
router.patch("/patchTask/:id/move", patchTask);
router.patch("/assign-sprint", patchSprint);
router.post("/create-sprint", createSprint);
router.get("/get-task-sprint/:sprintid", getTasksSprints);

router.get("/getTask/:id", getTasksOfProject);

router.put("/updateTask/:id", updateTaskPhase);

router.patch("/update-task-phase/:id", patchTask);

//status update, kanban board
router.patch("/patchTask/:id", patchTask);

export default router;
