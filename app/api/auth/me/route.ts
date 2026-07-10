import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserById } from "@/services/auth.service";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }

    const user = await getUserById(session.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 401 }
      );
    }

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
    console.error("Get current user error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to get user." },
      { status: 500 }
    );
  }
}
