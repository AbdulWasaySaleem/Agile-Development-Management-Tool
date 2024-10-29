import express from "express";
import {
  addMemberToProject,
  allProjectController,
  changeProjectStatus,
  deleteProject,
  getProjectWithId,
  postProjectController,
} from "../controller/adminprojectController.js";

const router = express.Router();

router.get("/all-project", allProjectController);

router.post("/post-project", postProjectController);

router.get("/project/:id", getProjectWithId);

router.patch("/project-status/:id", changeProjectStatus);

router.patch("/add-new-member/:id", addMemberToProject);

router.delete("/delete-project/:id", deleteProject);

export default router;
