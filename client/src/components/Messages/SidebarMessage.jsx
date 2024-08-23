// SidebarMessage Component
import React from "react";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";

const SidebarMessage = () => {
  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="p-2 border-b border-gray-200 bg-gray-200 ">
        <SearchInput />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <Conversations />
      </div>
    </div>
  );
};

export default SidebarMessage;
