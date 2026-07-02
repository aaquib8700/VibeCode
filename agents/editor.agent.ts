import { generateCode } from "@/services/openai.service";
import { parseGeneratedFiles } from "@/lib/parser";
import { GeneratedFile } from "@/types/ai";
import { readSandboxFiles } from "@/services/sandbox.service";
interface EditorAgentInput {
    prompt: string;
    sandboxId: string;
}

export async function editorAgent(
  input: EditorAgentInput
): Promise<GeneratedFile[]> {
  const files = await readSandboxFiles(input.sandboxId);

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
You are editing an existing project.

User Request:

${input.prompt}

Existing Project Files:

${existingFiles}

Update the project according to the user's request.

Return ALL modified files.

Do not explain anything.

Return only code files in the required format.
`,
});

return parseGeneratedFiles(response);
}