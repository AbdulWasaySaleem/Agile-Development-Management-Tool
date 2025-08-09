import React, { useState } from "react";
import useSendMessages from "../../hooks/useSendMessages";
import Loading from "../Static/Loading";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, loading } = useSendMessages();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <form className="flex items-center border-t border-gray-200 bg-gray-100 p-4" onSubmit={handleSubmit}>
      <div className="flex-grow">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          className="w-full bg-white text-gray-800 rounded-lg p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button className="ml-4 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        {loading ? <Loading /> : "Send"}
      </button>
    </form>
  );
};

export default MessageInput;