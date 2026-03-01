import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/api";
import type { Message } from "../types/chat";

export function useChat() {
  // const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);
  const typingControllerRef = useRef<{ stop: boolean }>({ stop: false });
  const [messages, setMessages] = useState<Message[]>(() => {
  const sessionActive = localStorage.getItem("chat_session_active");

  if (!sessionActive) {
    return [];
  }

  const stored = localStorage.getItem("chat_messages");
    return stored ? JSON.parse(stored) : [];
  });

  const typeResponse = async (fullText: string) => {
    const messageId = crypto.randomUUID();

    typingControllerRef.current.stop = false;

    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        status: "streaming",
      },
    ]);

    let currentText = "";

    for (let i = 0; i < fullText.length; i++) {
      if (typingControllerRef.current.stop) break;

      currentText += fullText[i];

      await new Promise((resolve) => setTimeout(resolve, 20));

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: currentText }
            : msg
        )
      );
    }

    // mark as complete when stopped OR finished
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, status: "complete" }
          : msg
      )
    );
  };

  const handleStop = () => {
    typingControllerRef.current.stop = true;
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      createdAt: Date.now(),
      status: "complete",
    };

    const updatedHistory = [...messages, userMessage];
    setIsTyping(true); 

    // Only add user message
    setMessages(updatedHistory);

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

      // Save full conversation immediately
      const fullAssistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.data,
        createdAt: Date.now(),
        status: "complete",
      };

      const finalMessages = [...updatedHistory, fullAssistantMessage];
      localStorage.setItem("chat_messages", JSON.stringify(finalMessages));

      setLoading(false);
      setIsTyping(true);

      // Only animate via typeResponse
      await typeResponse(response.data);

      setIsTyping(false);

    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I couldn’t reach the server. Please try again.",
          createdAt: Date.now(),
          status: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput("");
    setError(null);
    localStorage.removeItem("chat_messages");
    localStorage.removeItem("chat_session_active");
  };

// useEffect(() => {
//   if (!loading && !isTyping && messages.length > 0) {
//     const lastMessage = messages[messages.length - 1];

//     // Only persist when last message is assistant and fully typed
//     if (lastMessage.role === "assistant") {
//       localStorage.setItem("chat_messages", JSON.stringify(messages));
//     }
//   }
// }, [messages, loading, isTyping]);

  useEffect(() => {
    const stored = localStorage.getItem("chat_messages");
    if (stored) {
        setMessages(JSON.parse(stored));
    }
    hasLoaded.current = true;
  }, []);

  return {
    messages,
    input,
    setInput,
    loading,
    isTyping,
    error,
    handleSend,
    handleStop,
    clearChat,
  };
}