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

Determine the project type.

Possible values:

landing
dashboard
portfolio
ecommerce
blog
chat
admin
form
marketing
other

Determine the visual style.

Possible values:

modern
minimal
glassmorphism
gradient
dark
light

Determine the theme.

Examples:

spotify
youtube
netflix
github
stripe
apple
saas
banking
education
travel
food
fitness

If no obvious theme exists, return "custom".

Return ONLY valid JSON.

Example:

{
{
  "title": "Spotify Landing Page",
  "framework": "react",
  "type": "landing",
  "style": "modern",
  "theme": "spotify",
  "prompt": "Create a modern Spotify landing page with premium sections, playlists, responsive design and beautiful UI."
}

User Request:

${userPrompt}
`,
    systemPrompt: `
Return ONLY valid JSON.

The response MUST exactly match this shape:

{
"title":"",
"framework":"",
"type":"",
"style":"",
"theme":"",
"prompt":""
}

Never use markdown.
Never use backticks.
Never explain anything.
`,
  });

  return JSON.parse(response);
}
