


import React, { useState, useEffect } from "react";
import { TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Chat from "./Chat";
import "../styles/Chatwindow.css";
import { getResponse, addMessage,setActiveThread } from "../features/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { v1 as uuid } from "uuid";

export default function Chatwindow() {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");

  // ✅ Redux state
  const { messages, chatstatus, activeThreadId } = useSelector(
    (state) => state.chat
  );

  // ✅ When user sends a message
  // const handleSend = () => {
  //   if (!input.trim() || chatstatus === "loading") return;

  //   // Use existing thread or create new one
  //   const threadId = activeThreadId || uuid();

  //   // ✅ Add user message immediately
  //   dispatch(addMessage({ role: "user", content: input }));

  //   // ✅ Send message to backend
  //   dispatch(getResponse({ threadId, message: input }));

  //   setInput("");
  // };
  const handleSend = () => {
  if (!input.trim() || chatstatus === "loading") return;

  // ✅ If no active thread, create a new one
  let threadId = activeThreadId;
  if (!activeThreadId) {
    threadId = uuid();
    dispatch(setActiveThread(threadId)); // set this as active thread
  }

  // ✅ Add user message locally
  dispatch(addMessage({ role: "user", content: input }));

  // ✅ Send to backend
  dispatch(getResponse({ threadId, message: input }));

  setInput("");
};

  // ✅ Optional: auto-focus input when thread changes
  useEffect(() => {
    setInput("");
  }, [activeThreadId]);

  return (
    <div className="chat-window">
      {/* CHAT MESSAGES */}
      <div className="chat-content">
        <Chat messages={messages} />
        {chatstatus === "loading" && (
          <div className="typing-indicator">Assistant is thinking...</div>
        )}
      </div>

      {/* USER INPUT */}
      <div className="user-message">
        <div className="input-wrapper">
          <TextField
            id="glassy-input"
            label="Type your message here"
            variant="filled"
            multiline
            maxRows={6}
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            sx={{
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              textarea: { color: "white", resize: "none", overflow: "hidden" },
              label: { color: "rgba(255,255,255,0.8)" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.8)" },
              },
            }}
          />
          <IconButton
            className="send-icon"
            onClick={handleSend}
            sx={{ color: "white", position: "absolute", right: "-40px", bottom: "12px" }}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

