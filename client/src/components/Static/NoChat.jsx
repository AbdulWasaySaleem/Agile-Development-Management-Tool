import React from 'react';

const NoChat = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
      <div className="mb-4">
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 8h10M7 12h6m-2 8H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2h-3l-4 4z"
          ></path>
        </svg>
      </div>
      <p className="text-lg font-semibold">No Conversation Selected</p>
      <p className="text-sm mt-2">
        Select a conversation to start messaging or create a new one.
      </p>
    </div>
  );
};

export default NoChat;
