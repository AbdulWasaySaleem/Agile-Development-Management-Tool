import JWT from "jsonwebtoken";
import userModel from "../Model/userModel.js";

export const requireSignIn = (req, res, next) => {
  try {
    //console.log("Secrete", process.env.JWT_SECRET);
    //console.log("headers", req.headers.authorization);

    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    //console.log("decode", decode);
    req.user = decode;
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
