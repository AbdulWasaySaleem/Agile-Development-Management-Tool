import express from "express";
import {
  allUser,
  approveUser,
  getPendingUser,
  getProfile,
  logOut,
  login,
  signUp,
  updateProfile,
  updateProfilePic,
} from "../controller/userController.js";
import {
  blockDemoUser,
  isAdmin,
  requireSignIn,
} from "../middleware/authmiddleware.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

//creating a user
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logOut);

//updating profile pic
router.put("/userprofile/:id", updateProfile);
router.put("/update-pic/:id", singleUpload, updateProfilePic);

router.get("/userprofile/:id", getProfile);

//getPendingUser
router.get("/pendinguser", getPendingUser);

router.put("/:id/approve", requireSignIn, isAdmin, blockDemoUser, approveUser);

router.get("/all-users", allUser);

//test route
router.get("/test", requireSignIn, isAdmin, (req, res) => {
  res.send({ message: "This is protected route of admin" });
});

export default router;
