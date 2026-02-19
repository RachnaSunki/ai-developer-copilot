from openai import OpenAI
import os
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL_NAME = "gpt-4o-mini"

SYSTEM_PROMPT = "You are a helpful AI assistant for developers."

def get_ai_response(user_input: str):
    try: 
        logger.info("Sending request to OpenAI model")
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_input}
            ]
        )
        return {
            "success": True,
            "data": response.choices[0].message.content
        }

    except Exception as e:
        logger.error(f"OpenAI error: {str(e)}")
        return {
            "success": False,
            "error": "Failed to process AI request."
        }