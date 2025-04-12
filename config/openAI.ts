import OpenAI from "openai";
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default openai;
