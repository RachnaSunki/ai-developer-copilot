from fastapi import FastAPI
from services.openai_service import get_ai_response
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

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


