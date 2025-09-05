import express from "express";
import {
  addSprint,
  allSprints,
  deleteSprint,
} from "../controller/sprintController.js";
import {
  blockDemoUser,
  isAdmin,
  requireSignIn,
} from "../middleware/authmiddleware.js";

const router = express.Router();

router.post(
  "/add-sprint/:projectId",
  requireSignIn,
  isAdmin,
  blockDemoUser,
  addSprint
);

router.get(
  "/all-sprints/:projectId",
  requireSignIn,
  isAdmin,
  blockDemoUser,
  allSprints
);

router.delete(
  "/delete-sprint/:id",
  requireSignIn,
  isAdmin,
  blockDemoUser,
  deleteSprint
);

export default router;
