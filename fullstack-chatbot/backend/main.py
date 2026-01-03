from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional
from uuid import UUID
import os

from groq import Groq

from db import init_db, close_db, get_db

# ------------------------------------
# Load environment variables
# ------------------------------------
load_dotenv()

# ------------------------------------
# Create FastAPI app
# ------------------------------------
app = FastAPI()

# ------------------------------------
# CORS (React frontend)
# ------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------
# Initialize Groq client
# ------------------------------------
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ------------------------------------
# Startup / Shutdown (DB Pool)
# ------------------------------------
@app.on_event("startup")
async def startup():
    await init_db()

@app.on_event("shutdown")
async def shutdown():
    await close_db()

# ------------------------------------
# Request model
# ------------------------------------
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[UUID] = None

# ------------------------------------
# Root route
# ------------------------------------
@app.get("/")
def read_root():
    return {"status": "Backend is running 🚀"}

# ------------------------------------
# Chat endpoint
# ------------------------------------
@app.post("/chat")
async def chat(req: ChatRequest):
    pool = await get_db()

    async with pool.acquire() as conn:
        # 1️⃣ Create conversation if missing
        if not req.conversation_id:
            row = await conn.fetchrow(
                "INSERT INTO conversations DEFAULT VALUES RETURNING id"
            )
            conversation_id = row["id"]
        else:
            conversation_id = req.conversation_id

        # 2️⃣ Save user message
        await conn.execute(
            """
            INSERT INTO messages (conversation_id, role, content)
            VALUES ($1, $2, $3)
            """,
            conversation_id,
            "user",
            req.message
        )

        # 3️⃣ Call Groq AI
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "user", "content": req.message}
            ],
        )

        reply = response.choices[0].message.content

        # 4️⃣ Save AI reply
        await conn.execute(
            """
            INSERT INTO messages (conversation_id, role, content)
            VALUES ($1, $2, $3)
            """,
            conversation_id,
            "bot",
            reply
        )

    return {
        "reply": reply,
        "conversation_id": conversation_id
    }
