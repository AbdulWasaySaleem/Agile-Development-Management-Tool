import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import userMessageRoute from "./routes/userMessageRoute.js";
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3002;
server.listen(port, () => {
  // Connection to DB
  connectDB();
  console.log(`Server is running at http://localhost:${port}/`);
});
