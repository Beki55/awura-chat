import { doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

// Create or fetch a chat between two users
export const getOrCreateChat = async (user1Uid, user2Uid) => {
  const chatId = [user1Uid, user2Uid].sort().join("_");
  const chatRef = doc(db, "chats", chatId);

  try {
    const chatDoc = await getDoc(chatRef);
    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        participants: [user1Uid, user2Uid],
        messages: [],
        createdAt: new Date(),
      });
    }
    return chatId;
  } catch (error) {
    console.error("Error creating or fetching chat:", error);
  }
};

// Add a message to the chat
export const addMessageToChat = async (chatId, senderUid, text) => {
  const chatRef = doc(db, "chats", chatId);
  try {
    await updateDoc(chatRef, {
      messages: arrayUnion({
        sender: senderUid,
        text,
        timestamp: new Date(),
      }),
    });
  } catch (error) {
    console.error("Error adding message:", error);
  }
};

// Listen for real-time updates to a chat
export const listenToChat = (chatId, callback) => {
  const chatRef = doc(db, "chats", chatId);
  return onSnapshot(chatRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().messages);
    }
  });
};