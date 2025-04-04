import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDOE8FATKwYueqVZNNiqBBizm59WDGbkgI",
    authDomain: "awura-chat.firebaseapp.com",
    projectId: "awura-chat",
    storageBucket: "awura-chat.firebasestorage.app",
    messagingSenderId: "306073103831",
    appId: "1:306073103831:web:c2588f978be8d94c47af92",
    measurementId: "G-FV6YBT42XS"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Export Firebase Auth
export const auth = getAuth(app);