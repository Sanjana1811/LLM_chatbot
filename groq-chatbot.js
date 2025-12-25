import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const response = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "user", content: "Hello! Explain closures in JavaScript." }
  ],
});

console.log(response.choices[0].message.content);
