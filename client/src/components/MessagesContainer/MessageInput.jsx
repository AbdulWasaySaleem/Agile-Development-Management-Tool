import React, { useRef, useState } from "react";
import useSendMessages from "../../hooks/useSendMessages";
import Loading from "../UI/Loading";

const MessageInput = () => {
  const [message, setMessage] = useState();

  const { sendMessage, loading } = useSendMessages();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("clicked", message);
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <form
      className="flex items-center border-t border-gray-700 bg-gray-800 p-4"
      onSubmit={handleSubmit}
    >
      <div className="flex-grow">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          className="w-full bg-gray-700 text-white rounded-lg p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button className="ml-4 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        {loading ? <Loading /> : "Send"}
      </button>
    </form>
  );
};

export default MessageInput;
