import { ProjectStatus } from "@/lib/generated/prisma/enums";
import { inngest } from "@/inngest";
import {
  createProject,
  updateProjectStatus,
} from "@/services/project.service";

export async function generateController(prompt: string) {
  let project;

  try {
    if (!prompt.trim()) {
      throw new Error("Prompt is required");
    }

    project = await createProject(prompt);

    await inngest.send({
      name: "project/generate",
      data: {
        projectId: project.id,
        prompt,
      },
    });

    return project;
  } catch (error) {
    if (project) {
      await updateProjectStatus(project.id, ProjectStatus.FAILED);
    }

    console.error("Generate Controller Error:", error);

    throw new Error("Failed to start project generation.");
  }
}