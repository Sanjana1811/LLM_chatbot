import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
    apikey: process.env.OPENAI_API_KEY
})

const response = await client.responses.create({
  model: "gpt-4.1-mini",
  input: "Hello, world!"
});

console.log('ss', response.output_text);