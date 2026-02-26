from fastapi import FastAPI
from services.openai_service import get_ai_response
from pydantic import BaseModel, Field
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware


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

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    conversation = request.messages
    ai_response = get_ai_response(conversation)
    print("AI Response:", ai_response)  # Debugging log
    return ai_response


