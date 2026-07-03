import { generateCode } from "@/services/openai.service";

export interface EditPlan {
  summary: string;
  affectedFiles: string[];
}

interface EditPlannerInput {
  prompt: string;
  files: string[];
}

export async function editPlannerAgent(
  input: EditPlannerInput
): Promise<EditPlan> {
  const response = await generateCode({
    prompt: `
You are a senior software architect.

Your job is NOT to edit code.

Your job is ONLY to determine which files should be modified.

User Request:

${input.prompt}

Existing Files:

${input.files.join("\n")}

Rules:

- Return ONLY the files that actually need changes.
- Never include files that don't exist.
- Never invent file names.
- Never include package.json unless explicitly requested.
- Keep the affected file list as small as possible.

Return ONLY valid JSON.

Example:

{
  "summary": "Change the primary button color to orange",
  "affectedFiles": [
    "src/components/Button.tsx",
    "src/App.tsx"
  ]
}
`,
    systemPrompt: `
Return ONLY valid JSON.

Never explain anything.

Never use markdown.

Never use backticks.
`,
  });

  return JSON.parse(response);
}