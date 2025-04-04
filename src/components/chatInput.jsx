import React, { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="flex justify-center items-center p-4 w-96">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your message..."
        className="w-full p-2 border rounded-lg bg-white dark:bg-slate-700"
      />
      <button
        onClick={handleSend}
        className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;