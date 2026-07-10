import { NextRequest, NextResponse } from "next/server";
import { SigninSchema } from "@/lib/validations/auth";
import { authenticateUser } from "@/services/auth.service";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = SigninSchema.safeParse(body);
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

    const { email, password } = parsed.data;

    // Authenticate user
    const user = await authenticateUser(email, password);

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

    return NextResponse.json(
      { success: false, message },
      { status: 401 }
    );
  }
}
