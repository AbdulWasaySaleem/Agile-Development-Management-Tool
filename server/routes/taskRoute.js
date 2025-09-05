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
import {
  blockDemoUser,
  isAdmin,
  requireSignIn,
} from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/addtask", requireSignIn, isAdmin, blockDemoUser, addTasks);

router.post("/add-new-task", requireSignIn, isAdmin, blockDemoUser, addnewTask);
router.get("/alltask", getTasks);
router.delete(
  "/deleteTask/:id",
  requireSignIn,
  isAdmin,
  blockDemoUser,
  deleteTask
);
router.patch("/patchTask/:id/move", patchTask);
router.patch(
  "/assign-sprint",
  requireSignIn,
  isAdmin,
  blockDemoUser,
  patchSprint
);
router.post(
  "/create-sprint",
  requireSignIn,
  isAdmin,
  blockDemoUser,
  createSprint
);
router.get("/get-task-sprint/:sprintid", getTasksSprints);

router.get("/getTask/:id", getTasksOfProject);

router.put("/updateTask/:id", updateTaskPhase);

router.patch("/update-task-phase/:id", patchTask);

//status update, kanban board
router.patch("/patchTask/:id", patchTask);

export default router;
