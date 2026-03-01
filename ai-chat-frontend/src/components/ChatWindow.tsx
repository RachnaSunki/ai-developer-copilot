import { useEffect, useRef, useState } from "react";
import type { Message } from "../types/chat";
import MessageBubble from "./MessageBubble";


interface Props {
  messages: Message[];
  loading: boolean;
}

function ChatWindow({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [showEmpty, setShowEmpty] = useState(messages.length === 0);
  const prevLengthRef = useRef(messages.length);

  useEffect(() => {
    // 🔹 Empty state logic (unchanged behavior)
    if (messages.length > 0) {
      setTimeout(() => {
        setShowEmpty(false);
      }, 300);
    } else {
      setShowEmpty(true);
  }
   // 🔹 Auto-scroll ONLY if new message added
    if (messages.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    prevLengthRef.current = messages.length;
  }, [messages]);

  return (
  <div style={{ height: "100%", position: "relative" }}>
    {/* Empty State */}
    {showEmpty && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
          opacity: messages.length === 0 ? 1 : 0,
          
          transition: "opacity 0.3s ease",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#6b7280",
            }}
          >
            Start a new conversation
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#6b7280",
              maxWidth: "400px",
            }}
          >
            Ask anything about programming, system design, APIs, or AI engineering.
          </div>
        </div>
      </div>
    )}

    {/* Messages */}
        {messages.length > 0 && (
          <>
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}

            {/* Loading bubble */}
            {loading && (
            <MessageBubble
              message={{
                id: "loading",
                role: "assistant",
                content: "__loading__",
                createdAt: Date.now(),
                status: "streaming",
              }}
            />
          )}

            <div ref={bottomRef} />
          </>
    )}
  </div>
);
}

export default ChatWindow;