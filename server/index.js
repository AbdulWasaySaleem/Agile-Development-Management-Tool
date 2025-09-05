import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import userMessageRoute from "./routes/userMessageRoute.js";
import taskRoute from "./routes/taskRoute.js";
import projectRoute from "./routes/projectRoute.js";
import sprintRoute from "./routes/sprintRoute.js";
import xpRoute from "./routes/xpRoute.js";

import { app, server } from "./socket/socket.js";

// Configure .env
dotenv.config();

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", userRoute);
app.use("/api/message", messageRoute);
app.use("/api/usermessage", userMessageRoute);
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/sprint", sprintRoute);
app.use("/api/v1/xproute", xpRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT;
server.listen(port, () => {
  // Connection to DB
  connectDB();
  console.log(`Server is running at http://localhost:${port}/`);
});
