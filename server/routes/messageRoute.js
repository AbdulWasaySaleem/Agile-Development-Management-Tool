import express from "express";
import { getMessages, sendMessage } from "../controller/messageController.js";
import { blockDemoUser, isAdmin, requireSignIn } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/send/:id", requireSignIn, isAdmin,blockDemoUser,sendMessage);
router.get("/:id", requireSignIn, blockDemoUser,getMessages);

export default router;
