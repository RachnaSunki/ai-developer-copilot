import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { ArrowDown } from "lucide-react";
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
    
  } = useChat();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      const distanceFromBottom =
        scrollHeight - scrollTop - clientHeight;

      setIsAtBottom(distanceFromBottom < 20);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        backgroundColor: "#f4f6f8",
        padding: "24px",   // ✅ outer spacing
        boxSizing: "border-box",
        gap: "24px",
      }}>
      {/* ✅ Sidebar */}
      <div
        style={{
          width: "260px",
          backgroundColor: "white",
          borderRadius: "14px",       // ✅ round edges
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
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
          {/* Left: New Chat Icon */}
          <button
            onClick={createNewSession}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f3f4f6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            title="New Chat"
          >
            <SquarePen size={20} />
          </button>

          {/* Right: Model Dropdown */}
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
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          borderRadius: "14px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
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
          <div
            style={{
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            GenAI Assistant
          </div>

          <button
            onClick={createNewSession}
            disabled={loading || isTyping}
            title="New Chat"
            style={{
              border: "none",
              backgroundColor: "transparent",   // remove blue
              // padding: "6px",
              borderRadius: "8px",
              cursor: loading || isTyping ? "not-allowed" : "pointer",
              display: "flex",
              padding: "24px",
              // alignItems: "center",
              // justifyContent: "center",
              opacity: loading || isTyping ? 0.6 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            <SquarePen size={20} color="#111827" />
          </button>
        </div>

        <div ref={scrollRef} style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
          <ChatWindow messages={messages} loading={loading} />
        </div>

        <div style={{ position: "relative" }}>
        {!isAtBottom && (
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
              fontSize: "18px",
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