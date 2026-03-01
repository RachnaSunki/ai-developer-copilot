import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/api";
import type { Message, Session } from "../types/chat";

export function useChat() {
  // const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const typingControllerRef = useRef<{ stop: boolean }>({ stop: false });
  const [sessions, setSessions] = useState<Session[]>(() => {
    const stored = localStorage.getItem("chat_sessions");
    return stored ? JSON.parse(stored) : [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return localStorage.getItem("active_session_id");
  });

  const activeSession = sessions.find(
    (s) => s.id === activeSessionId
  );

  const messages = activeSession?.messages ?? [];
  console.log("sessions:", sessions);
console.log("activeSessionId:", activeSessionId);

  const createNewSession = () => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: "New Chat",
      createdAt: Date.now(),
      messages: [],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, []);

  const typeResponse = async (fullText: string) => {
    const messageId = crypto.randomUUID();
    typingControllerRef.current.stop = false;

    // 1️⃣ First insert empty streaming message
    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId
          ? {
              ...session,
              messages: [
                ...session.messages,
                {
                  id: messageId,
                  role: "assistant",
                  content: "",
                  createdAt: Date.now(),
                  status: "streaming",
                },
              ],
            }
          : session
      )
    );

    let currentText = "";

    for (let i = 0; i < fullText.length; i++) {
      if (typingControllerRef.current.stop) break;

      currentText += fullText[i];

      await new Promise((resolve) => setTimeout(resolve, 20));

      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? {
                ...session,
                messages: session.messages.map((msg) =>
                  msg.id === messageId
                    ? { ...msg, content: currentText }
                    : msg
                ),
              }
            : session
        )
      );
    }

    // 2️⃣ Mark as complete
    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId
          ? {
              ...session,
              messages: session.messages.map((msg) =>
                msg.id === messageId
                  ? { ...msg, status: "complete" }
                  : msg
              ),
            }
          : session
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
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== activeSessionId) return session;

        const isFirstMessage = session.messages.length === 0;

        return {
          ...session,
          title: isFirstMessage
            ? input.slice(0, 40)   // trim to 40 chars
            : session.title,
          messages: updatedHistory,
        };
      })
    );

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

      // const finalMessages = [...updatedHistory, fullAssistantMessage];
      // localStorage.setItem("chat_messages", JSON.stringify(finalMessages));

      setLoading(false);
      setIsTyping(true);

      // Only animate via typeResponse
      await typeResponse(response.data);

      setIsTyping(false);

    } catch (err: any) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? {
                ...session,
                messages: [
                  ...session.messages,
                  {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content:
                      "Sorry, I couldn’t reach the server. Please try again.",
                    createdAt: Date.now(),
                    status: "error",
                  },
                ],
              }
            : session
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    createNewSession();
    setInput("");
    setError(null);
  };

  useEffect(() => {
    localStorage.setItem(
      "chat_sessions",
      JSON.stringify(sessions)
    );

    if (activeSessionId) {
      localStorage.setItem(
        "active_session_id",
        activeSessionId
      );
    }
  }, [sessions, activeSessionId]);


  return {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createNewSession,
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