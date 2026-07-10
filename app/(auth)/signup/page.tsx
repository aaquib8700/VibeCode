"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function SignUpPage() {
  const { signup, loginWithGoogle, loginWithGithub, isLoading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Min 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await signup(name, email, password);
      addToast("success", "Account created! Welcome to VibeCode.");
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed. Please try again.";
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
      title="Create an account"
      subtitle="Get started with VibeCode for free"
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
          id="signup-name"
          label="Full name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
          autoComplete="name"
        />

        <Input
          id="signup-email"
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
          id="signup-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isLoading}
          className="w-full mt-2"
        >
          Create Account
        </Button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-[var(--text-tertiary)]">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-[var(--accent-glow)] hover:text-[var(--accent-indigo)] font-semibold transition-colors"
        >
          Sign In
        </Link>
      </p>
    </AuthCard>
  );
}
