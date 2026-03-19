import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { ArrowDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useChat } from "./hooks/useChat";
import { SquarePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function App() {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createNewSession,
    messages,
    input,
    setInput,
    loading,
    isTyping,
    handleSend,
    handleStop,
    handleRegenerate
  } = useChat();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const lastMessage = messages[messages.length - 1];
  const isStreaming = lastMessage?.status === "streaming";

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setIsAtBottom(distanceFromBottom < 20);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        backgroundColor: "#f4f6f8",
        // padding: "16px",
        position: "relative",
        // gap: "12px",
      }}
    >
      <div style={{ padding: "16px", display: "flex", width: "100%" }}>
      {/* ✅ Sidebar */}
      <div
        style={{
          width: isSidebarOpen ? "260px" : "0px",
          transition: "width 0.3s ease",
          overflow: "hidden",
          height: "100%",
          borderRadius: "14px",
          borderRight: isSidebarOpen ? "1px solid #e5e7eb" : "none",
        }}
      >
        {isSidebarOpen && (
          <div
            style={{
              height: "100%",
              backgroundColor: "white",
              // borderRadius: "14px",
              // boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <button
                onClick={createNewSession}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "8px",
                }}
              >
                <SquarePen size={20} />
              </button>

              <select
                style={{
                  flex: 1,
                  marginLeft: "12px",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                <option>gpt-4o-mini</option>
              </select>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginBottom: "6px",
                    fontSize: "13px",
                    backgroundColor:
                      session.id === activeSessionId
                        ? "#eef2ff"
                        : "transparent",
                  }}
                >
                  {session.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ✅ Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        style={{
          position: "absolute",
          top: "50%",
          left: isSidebarOpen ? "280px" : "17px",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          width: "15px",
          height: "28px",
          borderRadius: "6px",
          border: "1px solid #e5e7eb",
          backgroundColor: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          transition: "left 0.3s ease",
          fontSize: "18px",
        }}
      >
        {isSidebarOpen ? "‹" : "›"}
      </button>

      {/* ✅ Chat Container */}
      <div
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: "white",
          borderRadius: "14px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          marginLeft: "10px",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #eee",
            fontWeight: "bold",
            backgroundColor: "#fafafa",
            fontSize: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 600 }}>GenAI Assistant</div>

          <button
            onClick={createNewSession}
            disabled={loading || isTyping}
            style={{
              border: "none",
              backgroundColor: "transparent",
              cursor: loading || isTyping ? "not-allowed" : "pointer",
              opacity: loading || isTyping ? 0.6 : 1,
            }}
          >
            <SquarePen size={20} />
          </button>
        </div>

        {/* Chat Window */}
        <div
          ref={scrollRef}
          style={{ flex: 1, padding: "16px", overflowY: "auto" }}
        >
          <ChatWindow
            messages={messages}
            loading={loading}
            handleRegenerate={handleRegenerate}
          />
        </div>

        {/* Scroll Down Button + Input */}
          {!isAtBottom && !isStreaming && (
            <button
              onClick={() => {
                if (!scrollRef.current) return;
                scrollRef.current.scrollTo({
                  top: scrollRef.current.scrollHeight,
                  behavior: "smooth",
                });
              }}
              style={{
                position: "absolute",
                bottom: "80px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1px solid #e5e5e5",
                backgroundColor: "white",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowDown size={18} />
            </button>
          )}

          <div style={{ padding: "16px" }}>
            <ChatInput
              input={input}
              setInput={setInput}
              onSend={handleSend}
              loading={loading}
              isTyping={isTyping}
              onStop={handleStop}
            />
          </div>
        </div>
        </div>
    </div>
  );
}

export default App;