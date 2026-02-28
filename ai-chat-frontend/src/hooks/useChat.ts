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

        // 🔥 1. Build FULL assistant message
        const fullAssistantMessage: Message = {
          role: "assistant",
          content: response.data,
        };

        const finalMessages = [...updatedHistory, fullAssistantMessage];

        // 🔥 2. Save full conversation immediately
        localStorage.setItem("chat_messages", JSON.stringify(finalMessages));

        // 🔥 3. Set state with EMPTY assistant first (for typing)
        setMessages([...updatedHistory, { role: "assistant", content: "" }]);

        setLoading(false);
        setIsTyping(true);

        // 🔥 4. Animate typing using response.data
        await typeResponse(response.data);

        setIsTyping(false);

      }catch (err: any) {
        // Replace last assistant message with error
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Sorry, I couldn’t reach the server. Please try again.",
          };
          return updated;
        });

        // setError(err.message);
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
    console.log("Stored messages:", stored);
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
    clearChat,
  };
}