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

---

## 🏗 Project Structure

```
ai-dev-copilot/
│
├── main.py
├── services/
│ └── openai_service.py
├── requirements.txt
├── README.md
├── .gitignore
└── .env (not committed)
```


## 🧠 Architecture

Client → FastAPI → OpenAI Service → GPT-4o-mini → Response


- `main.py` handles API routing.
- `openai_service.py` handles LLM communication.
- `.env` securely stores API keys.

---

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
Route decorators (@app.get, @app.post)
Type hints
Service layer separation
Environment-based configuration
OpenAI API integration
Automatic Swagger documentation
```


## 🚧 Current Status

```bash
Backend AI integration complete
Modular architecture implemented
Frontend chat interface coming next
```


## 📌 Future Improvements

```bash
Implement Pydantic request validation
Add streaming responses
Connect React frontend
Deploy to cloud
Add logging & error handling improvements
```