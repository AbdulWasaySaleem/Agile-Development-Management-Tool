import JWT from "jsonwebtoken";
import userModel from "../Model/userModel.js";

// Middleware: require sign in
export const requireSignIn = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No Token Provided" });
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const user = await userModel.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

   //console.log("Authenticated User:", user); 

    req.user = user;
    next();
  } catch (error) {
    console.log("Error on middleware", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Middleware: only admin
export const isAdmin = async (req, res, next) => {
  try {
    //console.log("User Role:", req.user); // Debugging line
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "UnAuthorized Access",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({
      success: false,
      error,
      message: "middleware error in isAdmin",
    });
  }
};

// Middleware: block demo users from write operations
export const blockDemoUser = (req, res, next) => {
  try {
    if (req.user?.isDemoUser) {
      // Allow read-only (GET)
      if (req.method !== "GET") {
        return res.status(403).json({
          success: false,
          message: "Demo user cannot perform this action",
        });
      }
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({
      success: false,
      error,
      message: "middleware error in blockDemoUser",
    });
  }
};
