// Message Component
import React, { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import Loading from "../UI/Loading";
import AllMessages from "./AllMessages";
import useListenMessages from "../../hooks/useListenMessages";

const Message = () => {
  const { messages, loadings } = useGetMessages();
  useListenMessages()
  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  }, [messages]);

  return (
    <div className="px-2 py-4 flex-1 overflow-y-auto bg-gray-100">
      {!loadings && messages.length > 0 ? (
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <AllMessages message={message} />
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full">
          {loadings ? (
            <Loading />
          ) : (
            <p className="text-center text-gray-500">Start a conversation</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;