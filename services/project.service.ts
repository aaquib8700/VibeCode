import {prisma} from "@/lib/prisma";

export async function createProject(prompt: string) {
  try {
    const project = await prisma.project.create({
      data: {
        prompt,
      },
    });

    return project;
  } catch (error) {
    console.error("Failed to create project:", error);

    throw new Error("Unable to create project");
  }
}

export async function updateProjectStatus(
  projectId: string,
  status:
    | "PENDING"
    | "PLANNING"
    | "GENERATING"
    | "CREATING_SANDBOX"
    | "INSTALLING_DEPENDENCIES"
    | "RUNNING"
    | "COMPLETED"
    | "FAILED"
) {
  return await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      status,
    },
  });
}

export async function updateProjectPreview(
  projectId: string,
  previewUrl: string,
  sandboxId: string
) {
  return await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      previewUrl,
      sandboxId,
    },
  });
}