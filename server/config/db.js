import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_URL);
    console.log("Connect to MONGODB successfully");
  } catch (error) {
    console.log("Error connected to mongoDB", error.message);
  }
};

export default connectDB;
