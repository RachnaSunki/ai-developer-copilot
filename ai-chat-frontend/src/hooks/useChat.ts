import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/api";
import type { Message } from "../types/chat";

export function useChat() {
  // const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const [messages, setMessages] = useState<Message[]>(() => {
  const stored = localStorage.getItem("chat_messages");
  console.log("Initializer stored:", stored);
  return stored ? JSON.parse(stored) : [];
});

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const typingMessage: Message = {
      role: "assistant",
      content: "__typing__",
    };

    setMessages((prev) => [...prev, userMessage, typingMessage]);

    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await sendMessage({
        message: userMessage.content,
      });

      if (!response.success) {
        throw new Error(response.error || "Unknown server error");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data,
      };

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = assistantMessage;
        return updated;
      });
    } catch (err: any) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Error: Failed to get response.",
        };
        return updated;
      });

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("chat_messages");
    console.log("Stored messages:", stored);
    if (stored) {
        setMessages(JSON.parse(stored));
    }
    hasLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    console.log("Messages updated:", messages);

    localStorage.setItem("chat_messages", JSON.stringify(messages));
    }, [messages]);


  return {
    messages,
    input,
    setInput,
    loading,
    error,
    handleSend,
  };
}