import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//middleware
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3002;
//server listen
app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}/`);
});
