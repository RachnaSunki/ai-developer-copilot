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
  const sessionActive = localStorage.getItem("chat_session_active");

  if (!sessionActive) {
    return [];
  }

  const stored = localStorage.getItem("chat_messages");
    return stored ? JSON.parse(stored) : [];
  });


  const typeResponse = async (fullText: string) => {
    let currentText = "";

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" },
    ]);

    for (let i = 0; i < fullText.length; i++) {
      currentText += fullText[i];

      await new Promise((resolve) => setTimeout(resolve, 20)); // speed

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: currentText,
        };
        return updated;
      });
    }
  };

  const handleSend = async () => {
      if (!input.trim() || loading) return;

      const userMessage: Message = {
        role: "user",
        content: input,
      };

      const updatedHistory = [...messages, userMessage];

      // Add user message + empty assistant message
      setMessages([...updatedHistory, { role: "assistant", content: "" }]);

      localStorage.setItem("chat_session_active", "true");

      setInput("");
      setLoading(true);
      setError(null);

      try {
        const response = await sendMessage({
          messages: updatedHistory,
        });

        if (!response.success) {
          throw new Error(response.error || "Unknown server error");
        }

        // 🔥 Stop loading BEFORE typing
        setLoading(false);

        await typeResponse(response.data);

      }catch (err: any) {
        // Replace last assistant message with error
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
        // setLoading(false);
      }
    };

  const clearChat = () => {
    setMessages([]);
    setInput("");
    setError(null);
    localStorage.removeItem("chat_messages");
    localStorage.removeItem("chat_session_active");
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
    if (messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    handleSend,
    clearChat,
  };
}