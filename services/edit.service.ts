import { inngest } from "@/inngest/client";

interface EditProjectInput {
  projectId: string;
  sandboxId: string;
  prompt: string;
}

export async function editProject(
  input: EditProjectInput
) {
  await inngest.send({
    name: "project/edit",
    data: {
      projectId: input.projectId,
      sandboxId: input.sandboxId,
      prompt: input.prompt,
    },
  });

  return {
    success: true,
  };
}