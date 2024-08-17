import express from "express";
import { getMessages, sendMessage } from "../controller/messageController.js";
import { requireSignIn } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/send/:id", requireSignIn, sendMessage);
router.get("/:id", requireSignIn, getMessages);

export default router;
;;;