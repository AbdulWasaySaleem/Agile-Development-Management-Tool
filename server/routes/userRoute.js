import express from "express";
import { approveUser, createUser, getPendingUser, login } from "../controller/userController.js";
import { isAdmin, requireSignIn } from "../middleware/authmiddleware.js";

const router = express.Router();

//creating a user
router.post("/user", createUser);

router.post("/login", login);

//getPendingUser
router.get("/pendinguser", getPendingUser)

router.put("/:id/approve", approveUser)

//test route
router.get("/test", requireSignIn, isAdmin, (req, res) => {
  res.send({ message: "This is protected route of admin" });
});

export default router;
