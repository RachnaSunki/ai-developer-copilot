from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_ai_response(user_input: str):
    try: 
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant for developers."},
                {"role": "user", "content": user_input}
            ]
        )
        return {
            "success": True,
            "data": response.choices[0].message.content
        }

    except Exception as e:
        print("OpenAI API error:", e)
        return {
            "success": False,
            "error": "Failed to process AI request."
        }