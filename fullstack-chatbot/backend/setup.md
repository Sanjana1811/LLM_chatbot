## How to Run

From the backend folder:

uvicorn main:app --reload

## What You Should See
Browser:

http://127.0.0.1:8000/

{ "status": "Backend is running 🚀" }


http://127.0.0.1:8000/docs
➡ Swagger UI







## More features 


React (file upload)
   ↓
FastAPI (extract text)
   ↓
Groq (analyze text)

**pip install pypdf python-docx**

if file.filename.endswith(".pdf"):
    # extract with pypdf
elif file.filename.endswith(".docx"):
    # extract with python-docx

