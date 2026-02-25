interface Props {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  loading: boolean;
}

function ChatInput({ input, setInput, onSend, loading }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        value={input}
        placeholder="Type your message..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !loading) {
            onSend();
          }
        }}
        disabled={loading}
        style={{
          flex: 1,
          padding: "12px 14px",
          borderRadius: "10px",
          border: "none",
          outline: "none",
          backgroundColor: "#f1f3f5",
          fontSize: "14px",
        }}
      />

      <button
        onClick={onSend}
        disabled={loading}
        style={{
          padding: "12px 18px",
          borderRadius: "10px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: loading ? "#94a3b8" : "#2563eb",
          color: "white",
          fontWeight: 500,
          fontSize: "14px",
          opacity: loading ? 0.7 : 1,
          transition: "all 0.2s ease",
        }}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

export default ChatInput;