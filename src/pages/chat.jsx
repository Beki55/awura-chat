import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrCreateChat,
  sendMessage,
  setMessages,
} from "../redux/slice/chatSlice";
import { listenToChat } from "../services/chatService";
import ChatMessage from "../components/chatMessage";
import ChatInput from "../components/chatInput";
import { auth } from "../utils/firebase";
import { Smile } from "lucide-react"; // Import the 'UserPlus' icon from lucide-react
import RingLoader from "react-spinners/RingLoader";

const Chat = () => {
  const { otherUserId } = useParams();
  const dispatch = useDispatch();
  const { chatId, messages, loading } = useSelector((state) => state.chat);

  // Fetch or create chat when component mounts or otherUserId changes
  useEffect(() => {
    const initChat = async () => {
      const currentUserId = auth.currentUser?.uid;
      if (currentUserId && otherUserId) {
        await dispatch(
          fetchOrCreateChat({ user1Uid: currentUserId, user2Uid: otherUserId })
        );
      }
    };

    initChat();
  }, [dispatch, otherUserId]);

  // Listen to chat once chatId is available and update messages
  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = listenToChat(chatId, (newMessages) => {
      // Only dispatch new messages if they are not already in the state
      const filteredMessages = newMessages.filter(
        (newMessage) => !messages.some((msg) => msg.id === newMessage.id)
      );

      if (filteredMessages.length > 0) {
        dispatch(setMessages([...messages, ...filteredMessages])); // Append new messages
      }
    });

    return () => unsubscribe();
  }, [chatId, messages, dispatch]);

  const handleSend = async (text) => {
    if (chatId) {
      const currentUserId = auth.currentUser.uid;
      await dispatch(sendMessage({ chatId, senderUid: currentUserId, text }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-2 pb-20 md:pb-10 dark:bg-slate-800">
      {/* Messages Section */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 md:px-6 lg:px-8">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 bg-opacity-75 z-50">
            <RingLoader
              size={70}
              thickness={200}
              speed={100}
              color="rgba(57, 143, 172, 1)"
            />
          </div>
        )}

        {/* If no messages, display "say hi" message with icon */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 mt-12">
            <Smile size={48} className="text-blue-400 dark:text-blue-600" />
            <p className="text-xl text-gray-500 dark:text-gray-300">
              Say hi to start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isSender={message.sender === auth.currentUser.uid}
            />
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="flex justify-center items-center py-4 md:py-6">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default Chat;
