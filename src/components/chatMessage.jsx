import React from "react";

const ChatMessage = ({ message, isSender }) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "items-start space-x-3"}`}>
      {!isSender && (
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="w-10 h-10 rounded-full"
        />
      )}
      <div
        className={`p-3 rounded-lg shadow-md ${
          isSender ? "bg-blue-500 text-white" : "bg-white text-gray-700"
        }`}
      >
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;