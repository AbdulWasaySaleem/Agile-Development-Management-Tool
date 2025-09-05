import express from "express";
import {
  addMemberToProject,
  allProjectController,
  changeProjectStatus,
  deleteProject,
  getProjectWithId,
  postProjectController,
} from "../controller/adminprojectController.js";
import { blockDemoUser, isAdmin, requireSignIn } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/all-project", allProjectController);

router.post("/post-project", requireSignIn, isAdmin, blockDemoUser,postProjectController);

router.get("/project/:id", getProjectWithId);

router.patch("/project-status/:id",requireSignIn, isAdmin, blockDemoUser, changeProjectStatus);

router.patch("/add-new-member/:id",requireSignIn, isAdmin, blockDemoUser, addMemberToProject);

router.delete("/delete-project/:id",requireSignIn, isAdmin, blockDemoUser, deleteProject);

export default router;
