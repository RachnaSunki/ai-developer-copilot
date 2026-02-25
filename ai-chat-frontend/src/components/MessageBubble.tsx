import type { Message } from "../types/chat";

interface Props {
  message: Message;
}

function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          backgroundColor: isUser ? "#007bff" : "#e5e5ea",
          color: isUser ? "white" : "black",
          padding: "10px 14px",
          borderRadius: "16px",
          maxWidth: "70%",
        }}
      >
        {message.content === "__typing__" ? (
          <div style={{ display: "flex", gap: "6px" }}>
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}

export default MessageBubble;