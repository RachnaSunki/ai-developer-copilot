import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../types/chat";
import { Copy, Check } from "lucide-react";

interface Props {
  message: Message;
}

function MessageBubble({ message }: Props) {
  if (message.content === "__loading__") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            backgroundColor: "#f3f4f6",
            padding: "10px 14px",
            borderRadius: "16px",
            display: "flex",
            gap: "6px",
          }}
        >
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    );
  }

  if (!message.content) return null;

  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          backgroundColor: isUser ? "#2563eb" : "transparent",
          color: isUser ? "white" : "#111827",
          padding: isUser ? "8px 14px" : "0px",
          borderRadius: "16px",
          maxWidth: "75%",
          position: "relative",
          lineHeight: "1.6",
        }}
      >
        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }: any) {
                const codeText = String(children).replace(/\n$/, "");

                if (inline || !codeText.includes("\n")) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }

                return <CodeBlock codeText={codeText} />;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ codeText }: { codeText: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          border: "none",
          backgroundColor: copied ? "#2563eb" : "#e5e7eb",
          color: copied ? "white" : "#374151",
          padding: "6px",
          borderRadius: "6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>

      <pre>
        <code>{codeText}</code>
      </pre>
    </div>
  );
}

export default MessageBubble;