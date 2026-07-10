import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json({
      success: true,
      message: "Signed out successfully.",
    });
  } catch (error) {
    console.error("Signout error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to sign out." },
      { status: 500 }
    );
  }
}
