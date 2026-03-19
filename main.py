from fastapi import FastAPI
from services.openai_service import SYSTEM_PROMPT, get_ai_response
from pydantic import BaseModel, Field
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI

client = AsyncOpenAI()


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    success: bool
    data: Optional[str] = None
    error: Optional[str] = None

    
@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.post("/chat")
async def chat(request: ChatRequest):

    async def stream_generator():
        try:
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages = [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    *[m.dict() for m in request.messages]
                ],
                stream=True,  # 🔥 enables streaming
            )

            async for chunk in response:
                content = chunk.choices[0].delta.content
                if content:
                    yield content

        except Exception as e:
            yield f"\n[ERROR]: {str(e)}"

    return StreamingResponse(stream_generator(), media_type="text/plain")


