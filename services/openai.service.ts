import openai from "@/lib/openai";
import { SYSTEM_PROMPT } from "@/prompts";

interface GenerateCodeOptions {
  prompt: string;
  systemPrompt?: string;
}

export async function generateCode({
  prompt,
  systemPrompt = SYSTEM_PROMPT,
}: GenerateCodeOptions) {
  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: systemPrompt,
      input: prompt,
      store: false,
    });

    return response.output_text;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error("Failed to generate code");
  }
}