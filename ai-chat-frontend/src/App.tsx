import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { useChat } from "./hooks/useChat";

function App() {
  const {
    messages,
    input,
    setInput,
    loading,
    error,
    handleSend,
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
            padding: "16px",
            borderBottom: "1px solid #eee",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          GenAI Assistant
        </div>

        <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
          <ChatWindow messages={messages} />
        </div>

        {error && (
          <div style={{ color: "red", padding: "0 16px 8px 16px" }}>
            {error}
          </div>
        )}

        <div style={{ padding: "16px", borderTop: "1px solid #eee" }}>
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;