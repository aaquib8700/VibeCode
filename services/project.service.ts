import {prisma} from "@/lib/prisma";
import { ProjectStatus } from "@/lib/generated/prisma/enums";

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
  status:ProjectStatus
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

export async function getProject(projectId: string) {
  return prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
}

export async function updateProjectFiles(projectId: string, files: any[]) {
  return await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      files: files as any,
    } as any,
  });
}

