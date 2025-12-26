React (Frontend)
   |
   |  HTTP request (user message)
   v
FastAPI (Python Backend)
   |
   |  Groq SDK + API Key
   v
Groq API



# More featres 

React (text input)
   ↓
FastAPI
   ↓
Groq LLM


# Upload Files (PDF / TXT / DOC)

Groq can’t read files directly — you must extract text first.

React (file upload)
   ↓
FastAPI (extract text)
   ↓
Groq (analyze text)
