export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "email" | "google" | "github";
}

export interface AuthResponse {
  success: boolean;
  data?: User;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function apiSignup(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function apiSignin(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function apiSignout(): Promise<{ success: boolean }> {
  const res = await fetch("/api/auth/signout", {
    method: "POST",
  });
  return res.json();
}

export async function apiGetMe(): Promise<AuthResponse> {
  const res = await fetch("/api/auth/me");
  return res.json();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
