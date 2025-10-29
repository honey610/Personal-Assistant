
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v1 as uuid } from "uuid";

axios.defaults.baseURL = "http://localhost:4000";
// https://personal-assistant-kytu.onrender.com/

// Send message to backend
export const getResponse = createAsyncThunk(
  "chat/getResponse",
  async ({ threadId, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/chat/newchat", {
        threadId,
        message,
      });
      return { threadId: response.data.threadId, messages: response.data.messages };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Get all threads
export const getThreads = createAsyncThunk(
  "chat/getThreads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/chat/allthreads");
      return response.data.thread.filter((t) => t.messages.length > 0);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Delete a thread
export const deleteThread = createAsyncThunk(
  "chat/deleteThread",
  async (threadId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/chat/deletethread/${threadId}`);
      return threadId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Get single thread
export const getThreadById = createAsyncThunk(
  "chat/getThreadById",
  async (threadId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/chat/singlethread/${threadId}`);
      return { threadId, messages: response.data.messages };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    threads: [],
    chatstatus: "idle",
    threadstatus: "idle",
    activeThreadId: null,
    error: null,
  },
  reducers: {
    setActiveThread: (state, action) => {
      const threadId = action.payload;
      const thread = state.threads.find((t) => t.threadId === threadId);

      state.activeThreadId = threadId;
      state.messages = thread ? [...thread.messages] : [];
    },
    resetChat: (state) => {
      state.messages = [];
      state.activeThreadId = null;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      state.messages.push(message);

      if (state.activeThreadId) {
        const idx = state.threads.findIndex((t) => t.threadId === state.activeThreadId);
        if (idx !== -1) {
          state.threads[idx].messages.push(message);
        } else {
          state.threads.push({ threadId: state.activeThreadId, messages: [message] });
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getResponse.pending, (state) => {
        state.chatstatus = "loading";
        state.error = null;
      })
      .addCase(getResponse.fulfilled, (state, action) => {
        const { threadId, messages } = action.payload;

        state.activeThreadId = threadId;
        state.messages = messages;

        const idx = state.threads.findIndex((t) => t.threadId === threadId);
        if (idx !== -1) {
          state.threads[idx].messages = messages;
        } else {
          state.threads.push({ threadId, messages });
        }

        state.chatstatus = "succeeded";
      })
      .addCase(getResponse.rejected, (state, action) => {
        state.chatstatus = "failed";
        state.error = action.payload?.message || "Error fetching response";
      })
      .addCase(getThreads.fulfilled, (state, action) => {
        state.threads = action.payload;
        state.threadstatus = "succeeded";
      })
      .addCase(deleteThread.fulfilled, (state, action) => {
        state.threads = state.threads.filter((t) => t.threadId !== action.payload);
        if (state.activeThreadId === action.payload) {
          state.activeThreadId = null;
          state.messages = [];
        }
      })
      .addCase(getThreadById.fulfilled, (state, action) => {
        const { threadId, messages } = action.payload;
        state.activeThreadId = threadId;
        state.messages = messages;

        const idx = state.threads.findIndex((t) => t.threadId === threadId);
        if (idx !== -1) {
          state.threads[idx].messages = messages;
        } else {
          state.threads.push({ threadId, messages });
        }
      });
  },
});

export const { setActiveThread, resetChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;

