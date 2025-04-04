import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOrCreateChat, addMessageToChat } from "../../services/chatService";

// Async thunk to fetch or create a chat
export const fetchOrCreateChat = createAsyncThunk(
  "chat/fetchOrCreateChat",
  async ({ user1Uid, user2Uid }, { rejectWithValue }) => {
    try {
      const chatId = await getOrCreateChat(user1Uid, user2Uid);
      return chatId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to send a message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, senderUid, text }, { rejectWithValue }) => {
    try {
      await addMessageToChat(chatId, senderUid, text);
      return { chatId, senderUid, text };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatId: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrCreateChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrCreateChat.fulfilled, (state, action) => {
        state.chatId = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrCreateChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          sender: action.payload.senderUid,
          text: action.payload.text,
          timestamp: new Date(),
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setMessages } = chatSlice.actions;
export default chatSlice.reducer;