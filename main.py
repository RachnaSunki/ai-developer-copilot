from fastapi import FastAPI
from services.openai_service import get_ai_response
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    
@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.post("/chat")
def chat(request: ChatRequest):
    user_input = request.message
    ai_response = get_ai_response(user_input)
    return {"response": ai_response}


