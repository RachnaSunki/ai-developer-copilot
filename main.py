from fastapi import FastAPI
from services.openai_service import get_ai_response

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.post("/chat")
def chat(message: dict):
    user_input = message.get("message")
    ai_response = get_ai_response(user_input)
    return {"response": ai_response}
