import express from "express";
import { createUser, login } from "../controller/userController.js";


const router = express.Router();


//creating a user 
router.post("/user", createUser);

router.post("/login", login)

export default router;
