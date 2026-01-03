from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from groq import Groq
from fastapi import UploadFile, File

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

# Root route (fixes 404 on /)
@app.get("/")
def read_root():
    return {"status": "Backend is running 🚀"}

# Chat endpoint
@app.post("/chat")
async def chat(req: ChatRequest):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": req.message}
        ],
    )

    return {"reply": response.choices[0].message.content}

# -----------------------------
# File Upload Endpoint
# -----------------------------
# @app.post("/upload")
# async def upload_file(file: UploadFile = File(...)):
#     content = await file.read()
#     text = content.decode("utf-8", errors="ignore")

#     return {"text": text}
   
