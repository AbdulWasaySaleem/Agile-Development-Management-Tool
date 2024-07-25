import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import userRoute from './routes/userRoute.js'

//vonfigure .env
dotenv.config();
//Conenction to DB
connectDB();

const app = express();

//middleware
app.use(express.json());
app.use(cors());


//Routes
app.use("/api/v1/auth", userRoute)


app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3002;
//server listen
app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}/`);
});
