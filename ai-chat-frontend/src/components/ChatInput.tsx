import { useRef, useEffect } from "react";

interface Props {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  loading: boolean;
}

function ChatInput({ input, setInput, onSend, loading }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, [input]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "12px",
      }}
    >
      <div
        style={{
          flex: 1,
          backgroundColor: "#f3f4f6",
          borderRadius: "14px",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevent new line
              if (!loading && input.trim()) {
                onSend();
              }
            }
          }}
          placeholder="Type your message..."
          rows={1}
          style={{
            width: "100%",
            resize: "none",
            border: "none",
            outline: "none",
            fontSize: "14px",
            backgroundColor: "transparent",
            maxHeight: "120px",
            overflowY: "auto",
          }}
        />
      </div>

      <button
        onClick={onSend}
        disabled={loading}
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "14px",
          padding: "14px 20px",
          fontSize: "14px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Send
      </button>
    </div>
  );
}

export default ChatInput;