import React, { useEffect } from "react";
import MessageInput from "./MessageInput";
import Message from "./Message";
import useConversation from "../../zustand/useConversation";
import NoChat from "../UI/NoChat";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  return (
    <div className="flex flex-col bg-gray-100 rounded-lg h-full">
      {!selectedConversation ? (
        <NoChat />
      ) : (
        <div className="flex flex-col h-full ">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-200">
            <div className="flex items-center gap-3">
              <img
                src={selectedConversation.profilePicture.url}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-bold text-gray-800">
                  {selectedConversation.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Message />
          </div>
          
          <div className="bg-gray-100 border-t border-gray-200">
            <MessageInput />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
