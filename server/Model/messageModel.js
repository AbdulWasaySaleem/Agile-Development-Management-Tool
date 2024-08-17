import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  message:{
    type: String, 
    required: true
  },
  conversationalId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'conversation',
    default:[]
  }
}, {timestamps: true});

export default mongoose.model("message", messageSchema); 


