import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { useChat } from "./hooks/useChat";
import { SquarePen } from "lucide-react";

function App() {
  const {
    messages,
    input,
    setInput,
    loading,
    isTyping,
    error,
    handleSend,
    clearChat,
  } = useChat();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "750px",
          height: "85vh",
          backgroundColor: "white",
          borderRadius: "14px",
          border: "1px solid #dcdcdc",
          boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
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
            onClick={clearChat}
            disabled={loading || isTyping}
            title="New Chat"
            style={{
              border: "none",
              backgroundColor: "transparent",   // remove blue
              padding: "6px",
              borderRadius: "8px",
              cursor: loading || isTyping ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading || isTyping ? 0.6 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            <SquarePen size={20} color="#111827" />
          </button>
        </div>

        <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
          <ChatWindow messages={messages} loading={loading} />
        </div>

        <div style={{ padding: "16px" }}>
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            loading={loading || isTyping || !input.trim()}
          />
        </div>
      </div>
    </div>
  );
}

export default App;