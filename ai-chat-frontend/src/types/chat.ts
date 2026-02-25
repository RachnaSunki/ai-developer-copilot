export interface ChatRequest {
  message: string;
  //messages?: Message[]
}

export interface ChatResponse {
  success: boolean;
  data: string;
  error: string | null;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}