import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../types/chat";
import { Copy, Check } from "lucide-react";
import { RotateCcw } from "lucide-react";

interface Props {
  message: Message;
  isLast?: boolean;
  onRegenerate?: () => void;
}

function MessageBubble({ message, isLast, onRegenerate }: Props) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content); 
      setCopied(true);

      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // ✅ Streaming loading state
  if (
    message.role === "assistant" &&
    message.status === "streaming" &&
    !message.content
  ) {
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
            padding: "10px 14px",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          •••
        </div>
      </div>
    );
  }

  if (!message.content) return null;

  return (
    <div style={{ marginBottom: "14px" }}>
      {/* Message */}
      <div
        style={{
          display: "flex",
          justifyContent: isUser ? "flex-end" : "flex-start",
        }}
      >
        <div
          style={{
            backgroundColor: isUser ? "#2563eb" : "transparent",
            color: isUser ? "white" : "#111827",
            padding: isUser ? "8px 14px" : "0px",
            borderRadius: "16px",
            maxWidth: "75%",
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

      {/* ✅ Regenerate Button (Polished) */}
      {message.role === "assistant" &&
        message.status === "complete" && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: "-8ypx",
              marginLeft: "-8px",
            }}
          >
             {message.role === "assistant" && isLast &&
              message.status === "complete" && 
              <button
              onClick={onRegenerate}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // width: "32px",
                // height: "28px",
                fontSize: "22px",
                borderRadius: "30px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#e5e7eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
             <RotateCcw size={16} />
            </button>}
            {message.role === "assistant" &&
              message.status === "complete" && 
              <button
                onClick={handleCopy}
                style={{
                  // position: "absolute",
                  // top: "8px",
                  // right: "8px",
                  fontSize: "22px",
                  border: "none",
                  backgroundColor: 'transparent',
                  color:  "#374151",
                  // padding: "6px",
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
        }
          </div>
        )}
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