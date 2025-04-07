import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrCreateChat,
  sendMessage,
  setMessages,
} from "../redux/slice/chatSlice";
import { listenToChat } from "../services/chatService";
import ChatMessage from "../components/chatMessage";
import ChatInput from "../components/chatInput";
import { auth, db } from "../utils/firebase";
import { ArrowLeft, Smile } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Chat = () => {
  const { otherUserId } = useParams();
  const dispatch = useDispatch();
  const { chatId, messages, loading } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();

  const [receiverInfo, setReceiverInfo] = useState(null);

  useEffect(() => {
    const initChat = async () => {
      const currentUserId = auth.currentUser.uid;
      await dispatch(
        fetchOrCreateChat({ user1Uid: currentUserId, user2Uid: otherUserId })
      );
    };
    initChat();
  }, [dispatch, otherUserId]);

  useEffect(() => {
    if (chatId) {
      const unsubscribe = listenToChat(chatId, (newMessages) => {
        dispatch(setMessages(newMessages));
      });
      return () => unsubscribe();
    }
  }, [chatId, dispatch]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const fetchReceiver = async () => {
      const receiverRef = doc(db, "users", otherUserId);
      const receiverSnap = await getDoc(receiverRef);
      if (receiverSnap.exists()) {
        setReceiverInfo(receiverSnap.data());
      }
    };
    fetchReceiver();
  }, [otherUserId]);

  const totalMessages = messages.length;
  const receiverSent = messages.filter(
    (msg) => msg.sender === otherUserId
  ).length;
  const receiverReceived = totalMessages - receiverSent;

  const handleSend = async (text) => {
    if (chatId) {
      const currentUserId = auth.currentUser.uid;
      await dispatch(sendMessage({ chatId, senderUid: currentUserId, text }));

      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

      const unsubscribe = listenToChat(chatId, (newMessages) => {
        dispatch(setMessages(newMessages));
      });
      setTimeout(() => unsubscribe(), 1000);
    }
  };
  

  return (
    <>
      <div
        onClick={() => navigate("/")}
        className="flex gap-1 p-6 fixed cursor-pointer z-10"
      >
        <ArrowLeft />
      </div>

      <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900">
        {/* Chat Section */}
        <div className="flex flex-col flex-1 md:mr-80">
          {/* Messages List */}
          <div
            ref={messagesContainerRef}
            className="flex-grow overflow-y-auto px-4 pt-20 pb-4 flex flex-col justify-end space-y-4"
          >
            {loading &&(
              <div className="flex items-center justify-center h-full">
                <p className="text-blue-500 dark:text-blue-400 text-xl">
                  Loading...
                </p>
              </div>
            ) } {messages.length === 0 ? (
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
          <div className="flex justify-center items-center sticky bottom-0 dark:bg-slate-900 z-10 px-4 py-2">
            <ChatInput onSend={handleSend} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden md:block fixed right-0 top-0 w-80 h-full overflow-y-auto border-l bg-white dark:bg-slate-900 px-4 py-6 z-20">
          {receiverInfo ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={receiverInfo.photoURL || "/logo.png"}
                  alt="Receiver Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-2">
                  {receiverInfo.name || "Unknown User"}
                </h2>
                <h2 className="text-sm text-gray-500 dark:text-gray-300">
                  {receiverInfo.email || "Unknown Email"}
                </h2>
              </div>

              {/* Total Counts */}
              <div className="grid grid-cols-3 gap-4 items-center border-t border-blue-300 pt-12 space-y-2">
                <p className="flex flex-col text-blue-600 dark:text-blue-400 font-medium">
                  <span className="font-bold p-4 text-center bg-blue-500 text-white rounded-2xl">
                    {totalMessages}
                  </span>
                  <span className="text-xs text-center mt-3">Total</span>
                </p>
                <p className="flex flex-col text-blue-600 dark:text-blue-400 font-medium">
                  <span className="font-bold p-4 text-center bg-blue-500 text-white rounded-2xl">
                    {receiverSent}
                  </span>
                  <span className="text-xs text-center mt-3">Sent</span>
                </p>
                <p className="flex flex-col text-blue-600 dark:text-blue-400 font-medium">
                  <span className="font-bold p-4 text-center bg-blue-500 text-white rounded-2xl">
                    {receiverReceived}
                  </span>
                  <span className="text-xs text-center mt-3">Receiver</span>
                </p>
              </div>

              {/* Circular Progress Charts */}
              <div className="flex justify-center pt-8 gap-4">
                <div className="w-32 h-32">
                  <CircularProgressbar
                    value={
                      totalMessages ? (receiverSent / totalMessages) * 100 : 0
                    }
                    text={`${Math.round(
                      totalMessages ? (receiverSent / totalMessages) * 100 : 0
                    )}%`}
                    styles={buildStyles({
                      textColor: "#3B82F6",
                      pathColor: "#3B82F6",
                      trailColor: "#E0E7FF",
                    })}
                  />
                  <p className="text-xs text-center mt-2 text-blue-700 dark:text-blue-300">
                    Receiver Sent
                  </p>
                </div>

                <div className="w-32 h-32">
                  <CircularProgressbar
                    value={
                      totalMessages
                        ? (receiverReceived / totalMessages) * 100
                        : 0
                    }
                    text={`${Math.round(
                      totalMessages
                        ? (receiverReceived / totalMessages) * 100
                        : 0
                    )}%`}
                    styles={buildStyles({
                      textColor: "#10B981",
                      pathColor: "#10B981",
                      trailColor: "#D1FAE5",
                    })}
                  />
                  <p className="text-xs text-center mt-2 text-green-600 dark:text-green-400">
                    Receiver Received
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-300">
              Loading receiver info...
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
