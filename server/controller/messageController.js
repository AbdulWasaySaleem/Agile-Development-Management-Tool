import conversationModel from "../Model/conversationModel.js";
import messageModel from "../Model/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; // Receiver ID from params
    const senderId = req.user._id; // Sender ID from authenticated user

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Invalid sender or receiver ID" });
    }

    // Check if a conversation already exists between the users
    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    // Create and save the new message
    const newMessage = new messageModel({
      senderId,
      receiverId,
      message,
      conversationalId: conversation._id,
    });

    // Add message ID to the conversation and save both
    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverId){
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const getMessages = async (req, res) => {
  try {
    const { id: userToChatID } = req.params; // Receiver ID
    const senderId = req.user._id; // Sender ID from authenticated user

    // Find existing conversation between users
    const conversation = await conversationModel
      .findOne({
        participants: { $all: [senderId, userToChatID] },
      })
      .populate("messages");

    if (!conversation) {
      // No conversation found, return an empty array
      return res.status(200).json([]);
    }

    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

