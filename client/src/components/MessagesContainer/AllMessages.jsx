import React from "react";
import { useAuth } from "../Context/UserContext";
import useConversation from "../../zustand/useConversation";

const AllMessages = ({ message }) => {
  const [auth] = useAuth();
  const { selectedConversation } = useConversation();

  const fromMe = message.senderId === auth.user.id;
  const profilePic = fromMe
    ? auth.user.pic
    : selectedConversation?.profilePicture?.url ||
      "default-placeholder-url.png";

  const alignmentClass = fromMe ? "justify-end" : "justify-start";
  const bubbleBgColor = fromMe ? "bg-blue-600" : "bg-blue-800";

  return (
    <div className={`flex items-end mb-4 ${alignmentClass}`}>
      {/* Display other user's profile picture on the left */}
      {!fromMe && (
        <div className="flex items-center mr-2">
          <img
            src={profilePic}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`flex flex-col p-3 rounded-lg ${bubbleBgColor} text-white max-w-xs`}
        style={{ wordWrap: "break-word" }}
      >
        <p>{message.message}</p>
        <div
          className={`text-xs text-gray-400 ${
            fromMe ? "text-right" : "text-left"
          }`}
        >
          <p>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Display your profile picture on the right */}
      {fromMe && (
        <div className="flex items-center ml-2">
          <img
            src={profilePic}
            alt="My Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default AllMessages;
