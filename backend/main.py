from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import os

# تحميل متغيرات البيئة
load_dotenv()

app = FastAPI(title="TimeTwin AI API")

# السماح للواجهة الأمامية بالاتصال
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenRouter Client
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

@app.get("/")
def home():
    return {
        "message": "TimeTwin AI Backend Running"
    }


@app.post("/chat")
def chat(data: dict):
    prompt = data.get("message", "").strip()

    if not prompt:
        return {
            "success": False,
            "error": "Message is required."
        }

    try:
        completion = client.chat.completions.create(
            model="poolside/laguna-xs-2.1:free",
            messages=[
                {
                    "role": "system",
                    "content": """
You are TimeTwin AI, a helpful AI assistant.

Rules:
- Answer the user's question directly.
- Do NOT introduce yourself unless the user asks who you are.
- Do NOT greet the user at the beginning of every response.
- Be clear, practical, and professional.
- Give detailed answers when needed.
- Help with programming, AI, productivity, studying, career growth, scheduling, and general knowledge.
- Use Markdown formatting when it improves readability.
"""
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=1200,
            temperature=0.7
        )

        return {
            "success": True,
            "response": completion.model_dump()["choices"][0]["message"]["content"]
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }