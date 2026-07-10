import { NextRequest, NextResponse } from "next/server";
import { AuthProvider } from "@/lib/generated/prisma/enums";
import { findOrCreateOAuthUser } from "@/services/auth.service";
import { createSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      return NextResponse.redirect(
        `${baseUrl}/signin?error=google_auth_failed`
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        `${baseUrl}/signin?error=google_not_configured`
      );
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Google token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(
        `${baseUrl}/signin?error=google_token_failed`
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken: string = tokenData.access_token;

    // Fetch user profile
    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!profileRes.ok) {
      console.error("Google profile fetch failed:", await profileRes.text());
      return NextResponse.redirect(
        `${baseUrl}/signin?error=google_profile_failed`
      );
    }

    const profile = await profileRes.json();

    // Find or create user
    const user = await findOrCreateOAuthUser(AuthProvider.GOOGLE, {
      providerAccountId: profile.id,
      email: profile.email,
      name: profile.name || profile.email.split("@")[0],
      avatar: profile.picture,
    });

    // Create session
    await createSession(user.id);

    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(
      `${baseUrl}/signin?error=google_auth_failed`
    );
  }
}
