export interface ChatRequest {
  messages: Message[];
}

export interface ChatResponse {
  success: boolean;
  data: string;
  error: string | null;
}

export type MessageStatus = "streaming" | "complete" | "error";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  status: MessageStatus;
}