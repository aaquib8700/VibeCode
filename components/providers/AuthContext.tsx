"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type User,
  apiSignin,
  apiSignup,
  apiSignout,
  apiGetMe,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if we have a valid session by calling /api/auth/me
  useEffect(() => {
    apiGetMe()
      .then((res) => {
        if (res.success && res.data) {
          setUser(res.data);
        }
      })
      .catch(() => {
        // Not authenticated — that's fine
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiSignin(email, password);
      if (!res.success) {
        throw new Error(res.message || "Sign in failed.");
      }
      setUser(res.data!);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      setIsLoading(true);
      try {
        const res = await apiSignup(name, email, password);
        if (!res.success) {
          throw new Error(res.message || "Sign up failed.");
        }
        setUser(res.data!);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // OAuth uses redirect-based flow — no async needed
  const loginWithGoogle = useCallback(() => {
    window.location.href = "/api/auth/google";
  }, []);

  const loginWithGithub = useCallback(() => {
    window.location.href = "/api/auth/github";
  }, []);

  const logout = useCallback(async () => {
    await apiSignout();
    setUser(null);
  }, []);

  return (
    <AuthContext value={{ user, isLoading, login, signup, loginWithGoogle, loginWithGithub, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
