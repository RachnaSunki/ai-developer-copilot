# 🚀 AI Developer Copilot (Work in Progress)

## 📌 Overview

AI-powered backend service that assists frontend developers with:

- Explaining React errors
- Reviewing code snippets
- Breaking down Jira tasks into actionable steps

This project is being built as part of a transition into **AI / GenAI Engineering**, focusing on real-time systems, LLM integration, and production-grade UX.

---

## 🛠 Tech Stack

### Backend
- Python 3.9+
- FastAPI
- Uvicorn
- OpenAI GPT-4o-mini
- python-dotenv
- Pydantic
- Logging (built-in Python logging module)

### Frontend
- React (Vite + TypeScript)
- Custom Hooks Architecture (`useChat`)
- React Markdown (GFM support)
- Lucide Icons

---

## 🏗 Project Structure

```
ai-dev-copilot/
│
├── backend/
│ ├── main.py
│ ├── services/
│ │ └── openai_service.py
│ ├── models/
│ │ └── schemas.py
│ ├── requirements.txt
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ └── types/
│ └── package.json
│
├── README.md
└── .gitignore
```


## 🧠 Architecture

### High-Level Flow

User Input (Frontend)
↓
useChat Hook (State Management)
↓
sendMessageStream (Fetch API + Streaming)
↓
FastAPI Endpoint (/chat)
↓
OpenAI API (Streaming Enabled)
↓
Chunked Response (tokens)
↓
Frontend Stream Reader (ReadableStream)
↓
UI Updates in Real-Time


### Backend Flow

Client Request → FastAPI Route → OpenAI Service → LLM → Stream Response

- `/chat` endpoint receives full conversation
- Calls OpenAI with `stream=True`
- Yields chunks via `StreamingResponse`
- Sends token-by-token response

---

### Frontend Flow

User → handleSend → add messages → stream → update UI per chunk

- Adds user message
- Adds empty assistant placeholder (`status: streaming`)
- Streams chunks → appends content
- Marks message as `complete`

---

### State Design

- Single source of truth: `sessions`
- Each session contains:
  - messages
  - metadata (title, id)

---

## 📦 API Contract

### Request Model

```json
{
  "messages": [
    { "role": "user", "content": "Explain React hooks" }
  ]
}
```

### Response Model

{
  "success": true,
  "data": "AI response here",
  "error": null
}

### Validation Rules
```bash
message must be a non-empty string
Request validation errors → 422
Response contract mismatch → 500
OpenAI failures handled gracefully
```


## ⚙️ Setup Instructions

### Backend 

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

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🛠 Development Phases

### Phase 1 – Backend Foundation

```bash
FastAPI setup
OpenAI integration
Request/response models
Error handling
Logging
API contract design
```

### Phase 2 – Frontend Chat UI

```bash
Chat UI built
Markdown rendering
Code blocks with copy
Input UX improvements
```

### Phase 3 – Conversation System

```bash
Session-based architecture
Multi-session support
LocalStorage persistence
Session switching
Message model standardization
```

### Phase 4 – Advanced Features

```bash
Real-time streaming (backend + frontend)
AbortController (stop generation)
Regenerate response feature
Auto-scroll improvements
UX polish & spacing fixes
```

## 🧠 Concepts Implemented

```bash
REST API design
Streaming responses (LLM integration)
AbortController (request cancellation)
ReadableStream handling (frontend)
State-driven UI architecture
Session-based conversation management
Custom React hooks (useChat)
Pydantic validation (input & output)
Service layer separation
Structured error handling
Logging for observability
Environment-based configuration
Frontend-backend contract design
```

## 📌 Future Improvements

```bash
Lightweight RAG (document-based Q&A)
Backend conversation memory (server-side)
Prompt engineering improvements
Streaming via SSE/WebSockets
Authentication & user sessions
Deployment (Vercel + Render)
```