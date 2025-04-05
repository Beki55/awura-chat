import React, { useEffect, useRef } from "react";
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
import { RingLoader } from "react-spinners";
import { Smile } from "lucide-react";

const Chat = () => {
  const { otherUserId } = useParams();
  const dispatch = useDispatch();
  const { chatId, messages, loading } = useSelector((state) => state.chat);

  const messagesEndRef = useRef(null); // 🔁 For auto-scroll

  useEffect(() => {
    const initChat = async () => {
      const currentUserId = auth.currentUser.uid;
      await dispatch(
        fetchOrCreateChat({ user1Uid: currentUserId, user2Uid: otherUserId })
      );

      if (chatId) {
        const unsubscribe = listenToChat(chatId, (newMessages) => {
          dispatch(setMessages(newMessages));
        });

        return () => unsubscribe(); // Cleanup
      }
    };

    initChat();
  }, [dispatch, otherUserId, chatId]);

  // 👇 Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (text) => {
    if (chatId) {
      const currentUserId = auth.currentUser.uid;
      await dispatch(sendMessage({ chatId, senderUid: currentUserId, text }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-2 pb-20 md:py-10 dark:bg-slate-900">
      {/* Messages Section */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
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

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 mt-12">
            <Smile size={48} className="text-blue-400 dark:text-blue-600" />
            <p className="text-xl text-gray-500 dark:text-gray-300">
              Say hi to start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            return (
              <div key={index} ref={isLast ? messagesEndRef : null}>
                <ChatMessage
                  message={message}
                  isSender={message.sender === auth.currentUser.uid}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Chat Input */}
      <div className="flex justify-center items-center">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default Chat;
