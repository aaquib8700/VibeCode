import { generateCode } from "@/services/openai.service";
import { parseGeneratedFiles } from "@/lib/parser";
import { GeneratedFile } from "@/types/ai";
import { readSandboxFiles } from "@/services/sandbox.service";
import { editPlannerAgent } from "./edit-planner.agent";

interface EditorAgentInput {
  prompt: string;
  sandboxId: string;
}

export async function editorAgent(
  input: EditorAgentInput
): Promise<GeneratedFile[]> {
  const files = await readSandboxFiles(input.sandboxId);

  const plan = await editPlannerAgent({
    prompt: input.prompt,
    files: files.map((file) => file.path),
  });

  const existingFiles = files
    .map(
      (file) => `
Path: ${file.path}

\`\`\`
${file.content}
\`\`\`
`
    )
    .join("\n");

  const response = await generateCode({
    prompt: `
You are a senior frontend engineer editing an existing project.

User Request:

${input.prompt}

Edit Summary:

${plan.summary}

Affected Files:

${plan.affectedFiles.join("\n")}

Existing Project Files:

${existingFiles}

Rules:

- Modify ONLY the affected files whenever possible.
- Do NOT regenerate the whole application.
- Preserve the existing architecture.
- Preserve existing components.
- Preserve imports unless changes are required.
- Never modify unrelated files.
- Never rename files unless explicitly requested.
- Never modify:
  - package.json
  - vite.config.ts
  - tsconfig.json
  - tsconfig.node.json
  - tailwind.config.js
  - postcss.config.js
  - index.html
  - src/main.tsx
  - src/index.css

Import Rules:

- Every imported file must exist.
- Every imported component must exist.
- Every imported package must exist.
- Never invent package names.
- Never invent exports.

Icons:

Use ONLY valid lucide-react icons.

Never use brand icons.

Return ONLY modified files.

Return ONLY valid JSON.

Example:

{
  "files": {
    "src/components/Navbar.tsx": "...",
    "src/App.tsx": "..."
  }
}
`,
  });

  const parsed = parseGeneratedFiles(response);

  return parsed.files;
}