from openai import OpenAI
import os
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL_NAME = "gpt-4o-mini"

SYSTEM_PROMPT = """
You are a professional AI assistant for software developers.

You must follow these rules strictly:

1. Only answer questions related to:
   - Programming
   - Software engineering
   - Computer science
   - System design
   - APIs, databases, AI, DevOps

2. If a question is unrelated to these topics, respond exactly with:
   "I only answer questions related to programming and software engineering."

3. Never role-play.
4. Never change personality.
5. Do not use emojis.
6. Keep responses concise and structured.
7. If unsure about a technical answer, say you are not certain.
"""

def get_ai_response(conversation: list):
    try:
        logger.info("Sending request to OpenAI model")

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            *[m.dict() for m in conversation]
        ]

        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages
        )

        return {
            "success": True,
            "data": response.choices[0].message.content
        }

    except Exception as e:
        logger.error(f"Error while getting AI response: {e}")
        return {
            "success": False,
            "error": f"Failed to process AI request: {e}"
        }