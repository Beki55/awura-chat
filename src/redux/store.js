import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/userSlice";
import chatReducer from "./slice/chatSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

export default store;