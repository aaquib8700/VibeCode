import { NextRequest, NextResponse } from "next/server";
import { AuthProvider } from "@/lib/generated/prisma/enums";
import { findOrCreateOAuthUser } from "@/services/auth.service";
import { createSession } from "@/lib/session";

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      return NextResponse.redirect(
        `${baseUrl}/signin?error=github_auth_failed`
      );
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        `${baseUrl}/signin?error=github_not_configured`
      );
    }

    // Exchange code for access token
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    if (!tokenRes.ok) {
      console.error("GitHub token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(
        `${baseUrl}/signin?error=github_token_failed`
      );
    }

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error("GitHub token error:", tokenData.error_description);
      return NextResponse.redirect(
        `${baseUrl}/signin?error=github_token_failed`
      );
    }

    const accessToken: string = tokenData.access_token;

    // Fetch user profile
    const profileRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!profileRes.ok) {
      console.error("GitHub profile fetch failed:", await profileRes.text());
      return NextResponse.redirect(
        `${baseUrl}/signin?error=github_profile_failed`
      );
    }

    const profile = await profileRes.json();

    // GitHub may not return email in profile — fetch from emails endpoint
    let email = profile.email;
    if (!email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (emailsRes.ok) {
        const emails: GitHubEmail[] = await emailsRes.json();
        const primary = emails.find((e) => e.primary && e.verified);
        email = primary?.email || emails[0]?.email;
      }
    }

    if (!email) {
      return NextResponse.redirect(
        `${baseUrl}/signin?error=github_no_email`
      );
    }

    // Find or create user
    const user = await findOrCreateOAuthUser(AuthProvider.GITHUB, {
      providerAccountId: String(profile.id),
      email,
      name: profile.name || profile.login,
      avatar: profile.avatar_url,
    });

    // Create session
    await createSession(user.id);

    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (error) {
    console.error("GitHub OAuth callback error:", error);
    return NextResponse.redirect(
      `${baseUrl}/signin?error=github_auth_failed`
    );
  }
}
