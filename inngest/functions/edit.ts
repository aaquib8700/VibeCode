import { ProjectStatus } from "@/lib/generated/prisma/enums";
import { editorAgent } from "@/agents/editor.agent";
import { updateProjectSandbox } from "@/services/sandbox.service";
import { updateProjectStatus, getProject, updateProjectFiles } from "@/services/project.service";
import { inngest } from "../client";

export const editProject = inngest.createFunction(
  {
    id: "edit-project",
    triggers: [
      {
        event: "project/edit",
      },
    ],
    retries: 2,
  },
  async ({ event, step }) => {
    const { projectId, sandboxId, prompt } = event.data;

    try {
      await step.run("updating-status", async () => {
        await updateProjectStatus(
          projectId,
          ProjectStatus.GENERATING
        );
      });

      const updatedFiles = await step.run(
        "editor-agent",
        async () => {
          return editorAgent({
            prompt,
            sandboxId
          });
        }
      );

      await step.run("update-sandbox", async () => {
        await updateProjectSandbox(
          sandboxId,
          updatedFiles
        );
      });

      await step.run("update-db-files", async () => {
        const project = await getProject(projectId);
        if (project) {
          const currentFiles = ((project as any).files as any[]) || [];
          const updatedFilesMap = new Map(updatedFiles.map((f: any) => [f.path, f.content]));
          
          const nextFiles = currentFiles.map((file: any) => {
            if (updatedFilesMap.has(file.path)) {
              return {
                path: file.path,
                content: updatedFilesMap.get(file.path),
              };
            }
            return file;
          });
          
          const currentPaths = new Set(currentFiles.map((f: any) => f.path));
          for (const file of updatedFiles) {
            if (!currentPaths.has(file.path)) {
              nextFiles.push(file);
            }
          }

          await updateProjectFiles(projectId, nextFiles);
        }
      });

      await step.run("running", async () => {
        await updateProjectStatus(
          projectId,
          ProjectStatus.RUNNING
        );
      });

      return {
        success: true,
        files: updatedFiles,
      };
    } catch (error) {
      console.error(error);

      await updateProjectStatus(
        projectId,
        ProjectStatus.FAILED
      );

      throw error;
    }
  }
);