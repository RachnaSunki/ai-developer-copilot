import type { ChatRequest, ChatResponse } from "../types/chat";

const BASE_URL = "http://localhost:8000";

export async function sendMessage(
  payload: ChatRequest
): Promise<ChatResponse> {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}