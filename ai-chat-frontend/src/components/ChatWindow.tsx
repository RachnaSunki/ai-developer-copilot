import { useEffect, useRef } from "react";
import type { Message } from "../types/chat";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: Message[];
}

function ChatWindow({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
  <>
    {messages.map((msg, index) => (
      <MessageBubble key={index} message={msg} />
    ))}
    <div ref={bottomRef} />
  </>
);
}

export default ChatWindow;