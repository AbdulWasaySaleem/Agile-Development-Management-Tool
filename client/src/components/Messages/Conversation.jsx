import React from "react";
import Divider from "../UI/Divider";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../Context/SocketContext"; // Import the socket context

const Conversation = ({ conversation, lastIdx }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUser } = useSocketContext();                         

  // Check if the current conversation's user is online
  const isOnline = onlineUser.includes(conversation._id);
  const isSelected = selectedConversation?._id === conversation._id;

  return (
    <>
      <div
        className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 w-full transition-colors duration-300 ${isSelected ? 'bg-gray-200' : ''}`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className="relative">
          <img
            src={conversation.profilePicture.url}
            alt="User's profile"
            className="w-12 h-12 rounded-full"
          />
          {/* Online Status Indicator */}
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'} border-2 border-white`}
          ></div>
        </div>
        <div className="ml-3">
          <p className="font-bold">{conversation.name}</p>
          <p className="text-sm text-gray-500">{conversation.role}</p>
        </div>
      </div>
      {!lastIdx && <Divider />}
    </>
  );
};

export default Conversation;
