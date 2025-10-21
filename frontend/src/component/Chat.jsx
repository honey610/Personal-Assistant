
import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css"


function Typewriter({ text }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0; 
    let current = "";
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        return;
      }
      current += text[i];
      setDisplayedText(current);
      i++;
    }, 10); // typing speed (ms per character)

    return () => clearInterval(interval);
  }, [text]);

  return <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{displayedText}</ReactMarkdown>;
}

export default function Chat({ messages }) {
  const chatEndRef = useRef(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [latestReply, setLatestReply] =useState(null);
  useEffect(() => {
    if (messages.length > 0) {
      setLatestReply(messages[messages.length - 1]);
    }
  }, [messages]);



  return (
    <div className="chat-sec">
     {messages.length===0&&<h3>Start your conversation...</h3>}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={msg.role === "user" ? "userMessage" : "answerMessage"}
        >
            {msg.role === "assistant" ? (
            <Typewriter text={msg.content} />
          ) : (
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {msg.content}
            </ReactMarkdown>
          )}
        {/* <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {msg.content}
            </ReactMarkdown> */}
            
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}



