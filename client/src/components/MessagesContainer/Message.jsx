import React, { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import Loading from "../UI/Loading";
import AllMessages from "./AllMessages";

const Message = () => {
  const { messages, loadings } = useGetMessages();

  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(()=>{
      lastMessageRef.current?.scrollIntoView({behavior: "smooth"})
    },1000)
  }, [messages]);

  return (
    <div className="px-2 py-4 flex-1 bg-gray-700 h-3/4 overflow-y-auto ">
      {!loadings && messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message._id}
            ref={lastMessageRef}
          >
            <AllMessages message={message} />
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full">
          {loadings ? (
            <Loading />
          ) : (
            <p className="text-center text-gray-400">Start a conversation</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
