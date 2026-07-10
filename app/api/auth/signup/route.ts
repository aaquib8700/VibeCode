import { NextRequest, NextResponse } from "next/server";
import { SignupSchema } from "@/lib/validations/auth";
import { registerUser } from "@/services/auth.service";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Register user
    const user = await registerUser(name, email, password);

    // Create session
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider.toLowerCase(),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";
    const status = message.includes("already exists") ? 409 : 500;

    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}
