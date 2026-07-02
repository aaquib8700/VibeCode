import { generateCode } from "@/services/openai.service";

export interface PlannerOutput {
  title: string;
  framework: "react" | "nextjs";
  prompt: string;
}

export async function plannerAgent(
  userPrompt: string
): Promise<PlannerOutput> {
  const response = await generateCode({
    prompt: `
You are a software architect.

Analyze the user's request.

Rules:

- If user explicitly mentions React -> framework = react
- If user explicitly mentions Next.js -> framework = nextjs
- Otherwise framework = react

Improve the prompt.

Return ONLY valid JSON.

Example:

{
  "title":"Ecommerce Landing Page",
  "framework":"react",
  "prompt":"Create a modern ecommerce landing page..."
}

User Request:

${userPrompt}
`,
    systemPrompt: `
Return ONLY valid JSON.
Never use markdown.
Never use backticks.
Never explain anything.
`,
  });

  return JSON.parse(response);
}