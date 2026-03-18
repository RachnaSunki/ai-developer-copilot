import type { ChatRequest, ChatResponse } from "../types/chat";

const BASE_URL = "http://localhost:8000";

export async function sendMessageStream(
  payload: any,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
) {
  const res = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.body) {
    throw new Error("No response body");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;

    const chunk = decoder.decode(value || new Uint8Array());

    if (chunk) {
      onChunk(chunk);
    }
  }
}