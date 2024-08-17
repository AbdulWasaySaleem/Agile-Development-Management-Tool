import React, { useEffect } from "react";
import MessageInput from "./MessageInput";
import Message from "./Message";
import useConversation from "../../zustand/useConversation";
import NoChat from "../UI/NoChat";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  // Cleanup function after logged out
  useEffect(() => {
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {!selectedConversation ? (
        <NoChat />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 rounded-t-xl">
            <div className="flex items-center gap-3">
              <img
                src={selectedConversation.profilePicture.url}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-bold">{selectedConversation.name}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <Message />
            <div className="bg-gray-800 border-t border-gray-700 rounded-b-xl">
              <MessageInput />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
