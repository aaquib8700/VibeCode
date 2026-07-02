import OpenAI from "openai";

console.log(
  "OPENAI KEY:",
  process.env.OPENAI_API_KEY?.slice(0, 20)
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;