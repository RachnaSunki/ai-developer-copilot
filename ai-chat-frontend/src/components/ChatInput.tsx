import { useRef, useEffect } from "react";
import { Square, Send } from "lucide-react";

interface Props {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  isTyping: boolean;
  onStop: () => void;
}

function ChatInput({ input, setInput, onSend, loading, isTyping, onStop }: Props) {
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
      {(loading || isTyping) ? (
        <button
          onClick={onStop}
          style={{
            backgroundColor: "#eaedf3",
            border: "none",
            borderRadius: "14px",
            padding: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          // onMouseEnter={(e) =>
          //   (e.currentTarget.style.backgroundColor = "#1f2937")
          // }
          // onMouseLeave={(e) =>
          //   (e.currentTarget.style.backgroundColor = "#111827")
          // }
        >
          <Square
            size={16}
            color="black"
            fill="black"
            strokeWidth={0}
          />
        </button>
        ) : (
          <button
            onClick={onSend}
            disabled={loading || isTyping || !input.trim()}
            onMouseEnter={(e) => {
              if (!loading && input.trim())
                e.currentTarget.style.backgroundColor = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              if (!loading && input.trim())
                e.currentTarget.style.backgroundColor = "#2563eb";
            }}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "14px",
              padding: "14px",
              cursor: loading || isTyping || !input.trim() ? "not-allowed" : "pointer",
              opacity: loading || isTyping || !input.trim() ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease", 
            }}
          >
            <Send size={18} />
          </button>
        )}
    </div>
  );
}

export default ChatInput;