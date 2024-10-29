import express from "express";
import { addSprint, allSprints, deleteSprint } from "../controller/sprintController.js";

const router = express.Router();

router.post("/add-sprint/:projectId", addSprint);

router.get("/all-sprints/:projectId", allSprints)

router.delete("/delete-sprint/:id", deleteSprint)

export default router