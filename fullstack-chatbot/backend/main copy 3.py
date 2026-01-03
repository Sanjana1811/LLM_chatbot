from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from groq import Groq
from fastapi import UploadFile, File

from db import get_db   # 👈 ADD THIS

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI()

# Allow React frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Request body model
class ChatRequest(BaseModel):
    message: str

# Root route
@app.get("/")
def read_root():
    return {"status": "Backend is running 🚀"}

# -----------------------------
# Chat endpoint (UPDATED)
# -----------------------------
@app.post("/chat")
async def chat(req: ChatRequest):
    conn = await get_db()

    try:
        # 1️⃣ Save user message
        await conn.execute(
            """
            INSERT INTO messages (role, content)
            VALUES ($1, $2)
            """,
            "user",
            req.message
        )

        # 2️⃣ Call Groq AI
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "user", "content": req.message}
            ],
        )

        reply = response.choices[0].message.content

        # 3️⃣ Save AI reply
        await conn.execute(
            """
            INSERT INTO messages (role, content)
            VALUES ($1, $2)
            """,
            "bot",
            reply
        )

        return {"reply": reply}

    finally:
        await conn.close()
