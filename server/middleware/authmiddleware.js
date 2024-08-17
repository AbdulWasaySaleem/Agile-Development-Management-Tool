import JWT from "jsonwebtoken";
import userModel from "../Model/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        error: "Unautorized -No Token Provided",
      });
    }
    //console.log("token", token);

    const decode = JWT.verify(token, process.env.JWT_SECRET);

    //console.log("decode", decode);
    if (!decode) {
      return res.status(401).json({
        error: "Unautorized -Invalid Token",
      });
    }

    const user = await userModel.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }
    //console.log("user:", user);

    req.user = user;
    next();
  } catch (error) {
    console.log("Error on middleware", error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    console.log(user);
    if (user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "middleware error in isAdmin",
    });
  }
};
