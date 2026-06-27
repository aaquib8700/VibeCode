import { NextRequest, NextResponse } from "next/server";
import { generateController } from "@/controllers/generate.controller";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const project = await generateController(prompt);

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Generate Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}