from fastapi import FastAPI
from services.openai_service import get_ai_response
from pydantic import BaseModel, Field
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)

class ChatResponse(BaseModel):
    success: bool
    data: Optional[str] = None
    error: Optional[str] = None

    
@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    user_input = request.message
    ai_response = get_ai_response(user_input)
    print("AI Response:", ai_response)  # Debugging log
    return ai_response


