import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Create an object to map user IDs to socket IDs
const userSocketMap = {};

// Initialize the Socket.IO server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"], // HTTP methods allowed
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Handle client connections
io.on("connection", (socket) => {
  console.log("User Connected: ", socket.id);

  // Retrieve userId from the connection query parameters
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id; // Map userId to socketId

  // Emit the list of online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle client disconnections
  socket.on("disconnect", () => {
    console.log("User Disconnected: ", socket.id);
    delete userSocketMap[userId]; // Remove the user from the map on disconnect

    // Emit the updated list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
