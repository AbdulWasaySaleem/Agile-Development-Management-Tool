import React from "react";
import SidebarMessage from "./SidebarMessage";
import MessageContainer from "../MessagesContainer/MessageContainer";

const Messages = () => {
  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6 flex h-[80vh]">
      {/* LeftSection */}
      <div className="w-1/5 border-r-8 border-gray-200">
        <SidebarMessage />
      </div>
      {/* RightSection */}
      <div className="w-3/4">
        <MessageContainer />
      </div>
    </div>
  );
};

export default Messages;