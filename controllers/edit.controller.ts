import { NextRequest, NextResponse } from "next/server";

import { editProject } from "@/services/edit.service";
import { EditProjectInput } from "@/types/ai";

export async function editController(req: NextRequest) {
  try {
    const body = (await req.json()) as EditProjectInput & {
      projectId: string;
      sandboxId: string;
    };

    const { projectId, sandboxId, prompt } = body;

    if (!projectId || !sandboxId || !prompt) {
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

    await editProject({
      projectId,
      sandboxId,
      prompt,
    });

    return NextResponse.json({
      success: true,
      message: "Edit request queued successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to queue edit request.",
      },
      {
        status: 500,
      }
    );
  }
}