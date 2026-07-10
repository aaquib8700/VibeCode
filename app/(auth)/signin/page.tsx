"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastContext";
import AuthCard, {
  GoogleButton,
  GitHubButton,
  OAuthDivider,
} from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function SignInForm() {
  const { login, loginWithGoogle, loginWithGithub, isLoading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Show OAuth error from query params (set by callback redirect)
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      const errorMessages: Record<string, string> = {
        google_auth_failed: "Google sign in failed. Please try again.",
        google_not_configured: "Google sign in is not configured.",
        github_auth_failed: "GitHub sign in failed. Please try again.",
        github_not_configured: "GitHub sign in is not configured.",
        github_no_email: "Could not retrieve email from GitHub.",
      };
      addToast("error", errorMessages[oauthError] || "OAuth sign in failed.");
    }
  }, [searchParams, addToast]);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(email, password);
      addToast("success", "Welcome back! Signed in successfully.");
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      router.push(callbackUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed. Please try again.";
      addToast("error", message);
    }
  }

  function handleGoogle() {
    loginWithGoogle();
  }

  function handleGithub() {
    loginWithGithub();
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your VibeCode account"
    >
      {/* OAuth Buttons */}
      <div className="space-y-3">
        <GoogleButton onClick={handleGoogle} loading={isLoading} />
        <GitHubButton onClick={handleGithub} loading={isLoading} />
      </div>

      <OAuthDivider />

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="signin-email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          id="signin-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isLoading}
          className="w-full mt-2"
        >
          Sign In
        </Button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-[var(--text-tertiary)]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[var(--accent-glow)] hover:text-[var(--accent-indigo)] font-semibold transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </AuthCard>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
