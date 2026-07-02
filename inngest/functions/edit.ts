import { ProjectStatus } from "@/lib/generated/prisma/enums";
import { editorAgent } from "@/agents/editor.agent";
import { updateProjectSandbox } from "@/services/sandbox.service";
import { updateProjectStatus } from "@/services/project.service";
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