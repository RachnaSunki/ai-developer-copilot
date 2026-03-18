import { useState, useEffect } from "react";
import { sendMessageStream } from "../services/api";
import type { Message, Session } from "../types/chat";

export function useChat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // ✅ Create new session
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

  // ✅ Send message with real streaming
  const handleSend = async () => {
    if (!input.trim() || loading || isTyping || !activeSessionId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      createdAt: Date.now(),
      status: "complete",
    };

    const assistantId = crypto.randomUUID();

    setIsTyping(true);
    setLoading(true);
    setError(null);

    // ✅ Add user + assistant placeholder
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== activeSessionId) return session;

        const isFirstMessage = session.messages.length === 0;

        return {
          ...session,
          title: isFirstMessage
            ? input.trim().slice(0, 40)
            : session.title,
          messages: [
            ...session.messages,
            userMessage,
            {
              id: assistantId,
              role: "assistant",
              content: "",
              createdAt: Date.now(),
              status: "streaming",
            },
          ],
        };
      })
    );

    const currentInput = input;
    setInput("");

    try {
      await sendMessageStream(
        { messages: [...messages, userMessage] },
        (chunk: string) => {
          setSessions((prev) =>
            prev.map((session) =>
              session.id === activeSessionId
                ? {
                    ...session,
                    messages: session.messages.map((msg) =>
                      msg.id === assistantId
                        ? {
                            ...msg,
                            content: msg.content + chunk,
                          }
                        : msg
                    ),
                  }
                : session
            )
          );
        }
      );

      // ✅ Mark complete
      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? {
                ...session,
                messages: session.messages.map((msg) =>
                  msg.id === assistantId
                    ? { ...msg, status: "complete" }
                    : msg
                ),
              }
            : session
        )
      );

    } catch (err) {
      console.error(err);

      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? {
                ...session,
                messages: session.messages.map((msg) =>
                  msg.id === assistantId
                    ? {
                        ...msg,
                        content:
                          "Sorry, I couldn’t reach the server. Please try again.",
                        status: "error",
                      }
                    : msg
                ),
              }
            : session
        )
      );
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  // ❌ Stop not needed for now (stream abort not implemented yet)
  const handleStop = () => {
    // future: abort controller
  };

  const clearChat = () => {
    createNewSession();
    setInput("");
    setError(null);
  };

  // ✅ Persist sessions
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

  // ✅ Ensure active session is valid
  useEffect(() => {
    if (sessions.length > 0) {
      const exists = sessions.some(
        (s) => s.id === activeSessionId
      );

      if (!activeSessionId || !exists) {
        setActiveSessionId(sessions[0].id);
      }
    }
  }, [sessions, activeSessionId]);

  // ✅ Initialize first session
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, []);

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