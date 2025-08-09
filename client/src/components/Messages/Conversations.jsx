// Conversations Component
import React from "react";
import Conversation from "./Conversation";
import useGetConversation from "../../hooks/useGetConversation";
import Loading from "../Static/Loading";

const Conversations = () => {
  const { loading, conversations } = useGetConversation();

  return (
    <div className="flex flex-col space-y-2">
      {loading && <Loading />}
      {conversations.map((conversation, idx) => (
  
        <Conversation
          key={conversation._id}
          conversation={conversation}
          lastIdx={idx === conversations.length - 1}
        />
      
      ))}
    </div>
  );
};

export default Conversations;
