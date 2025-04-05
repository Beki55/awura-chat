import React from "react";
import { User } from "lucide-react"; // Lucide user icon

const ChatMessage = ({ message, isSender }) => {
  return (
    <div
      className={`flex items-center ${isSender ? "justify-end" : "items-start space-x-3"}`}
    >
      {!isSender && <User className="w-7 h-7 text-blue-500 dark:text-white" />}
      <div
        className={`p-3 rounded-lg shadow-md ${
          isSender ? "bg-blue-500 text-white" : "bg-white text-gray-700"
        }`}
      >
        <p className="">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
