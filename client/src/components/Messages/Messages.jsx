import React from "react";
import SidebarMessage from "./SidebarMessage";
import MessageContainer from "../MessagesContainer/MessageContainer";

const Messages = () => {
  return (
    <div className="bg-gray-900 h-5/6 text-white rounded-lg shadow-lg p-6 flex">
      {/* LeftSection */}
      <div className="w-1/5 ">
        <SidebarMessage />
      </div>
      {/* RightSection */}
      <div className="w-3/4"><MessageContainer/></div>
    </div>
  );
};

export default Messages;
