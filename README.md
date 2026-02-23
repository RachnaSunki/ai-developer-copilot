# 🚀 AI Developer Copilot (Work in Progress)

## 📌 Overview

AI-powered backend service that assists frontend developers with:

- Explaining React errors
- Reviewing code snippets
- Breaking down Jira tasks into actionable steps

This project is being built as part of a transition into AI-focused backend engineering.

---

## 🛠 Tech Stack

- Python 3.9+
- FastAPI
- Uvicorn
- OpenAI GPT-4o-mini
- python-dotenv
- Pydantic
- Logging (built-in Python logging module)

---

## 🏗 Project Structure

```
ai-dev-copilot/
│
├── main.py
├── services/
│   └── openai_service.py
├── models/
│   └── schemas.py
├── requirements.txt
├── README.md
├── .gitignore
└── .env (not committed)
```


## 🧠 Architecture

Client → FastAPI → OpenAI Service → GPT-4o-mini → Response


- `main.py` handles API routing.
- `schemas.py` Request & response models (API contract).
- `openai_service.py` handles LLM communication.
- `.env` securely stores API keys.

---

## 📦 API Contract

### Request Model

{
  "message": "Explain React hooks"
}

### Response Model

{
  "success": true,
  "data": "AI response here",
  "error": null
}

```bash
Validation Rules
message must be a non-empty string
Request validation errors → 422
Response contract mismatch → 500
OpenAI failures handled gracefully
```


## ⚙️ Setup Instructions


```bash
1️⃣ Clone Repository
git clone <your-repo-url>
cd ai-dev-copilot


2️⃣ Create Virtual Environment
python -m venv venv
source venv/bin/activate   
venv\Scripts\activate    


3️⃣ Install Dependencies
pip install -r requirements.txt


4️⃣ Create .env File
Create a file named .env in the project root:
OPENAI_API_KEY=your_openai_api_key

5️⃣ Run the Server
uvicorn main:app --reload

Open in browser:
http://127.0.0.1:8000/docs
```

## 🧠 Concepts Implemented

```bash
REST API design
Route decorators
Type hints
Pydantic validation (input & output)
Response model enforcement
Service layer separation
Structured error handling
Logging for observability
Environment-based configuration
Swagger (OpenAPI) auto documentation
```

## ✅ Week 1 Status

```bash
Backend AI integration complete
Clean modular architecture
Request & response validation
Error handling implemented
Logging added
Fully tested with edge cases
```


## 📌 Future Improvements

```bash
Build React (Vite) chat interface
Connect frontend to backend
Implement loading & error UI states
```