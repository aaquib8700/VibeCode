import { NextRequest, NextResponse } from "next/server";

import { editorAgent } from "@/agents/editor.agent";
import { updateProjectSandbox } from "@/services/sandbox.service";
import { updateProjectStatus } from "@/services/project.service";
import { EditProjectInput } from "@/types/ai";

export async function editController(req: NextRequest) {
  try {
    const body = (await req.json()) as EditProjectInput & {
      projectId: string;
      sandboxId: string;
    };

    const { projectId, sandboxId, prompt } = body;

    if (!projectId || !sandboxId || !prompt ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields.",
        },
        {
          status: 400,
        }
      );
    }

    await updateProjectStatus(projectId, "GENERATING");

    const updatedFiles = await editorAgent({
      prompt,
      sandboxId,
    });

    await updateProjectSandbox(sandboxId, updatedFiles);

    await updateProjectStatus(projectId, "RUNNING");

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to edit project.",
      },
      {
        status: 500,
      }
    );
  }
}