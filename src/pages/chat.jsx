import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrCreateChat, sendMessage, setMessages } from "../redux/slice/chatSlice";
import { listenToChat } from "../services/chatService";
import ChatMessage from "../components/chatMessage";
import ChatInput from "../components/chatInput";
import { auth } from "../utils/firebase";

const Chat = () => {
  const { otherUserId } = useParams();
  const dispatch = useDispatch();
  const { chatId, messages, loading } = useSelector((state) => state.chat);

  useEffect(() => {
    const initChat = async () => {
      const currentUserId = auth.currentUser.uid;
      await dispatch(fetchOrCreateChat({ user1Uid: currentUserId, user2Uid: otherUserId }));

      // Listen for real-time updates
      if (chatId) {
        const unsubscribe = listenToChat(chatId, (newMessages) => {
          dispatch(setMessages(newMessages));
        });

        return () => unsubscribe(); // Cleanup listener on unmount
      }
    };

    initChat();
  }, [dispatch, otherUserId, chatId]);

  const handleSend = async (text) => {
    if (chatId) {
      const currentUserId = auth.currentUser.uid;
      await dispatch(sendMessage({ chatId, senderUid: currentUserId, text }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-2 pb-20 md:py-10 bg-gray-50 dark:bg-slate-800">
      {/* Messages Section */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {loading && <p>Loading...</p>}
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isSender={message.sender === auth.currentUser.uid}
          />
        ))}
      </div>

      {/* Chat Input */}
      <div className="flex justify-center items-center">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default Chat;