import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import connectDB from "./config/db.js";

import userRoute from "./routes/userRoute.js";

//vonfigure .env
dotenv.config();

//console.log("JWT_SECRET:", process.env.JWT_SECRET);
//Conenction to DB
connectDB();

//cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


//rest api
const app = express();

//middleware
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/v1/auth", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3002;
//server listen
app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}/`);
});
