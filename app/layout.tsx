import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthContext";
import { ToastProvider } from "@/components/providers/ToastContext";
import ClientShell from "@/components/layout/ClientShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VibeCode — AI-Powered App Builder",
  description:
    "Build stunning web applications in seconds with AI. Describe your vision and watch VibeCode generate, style, and preview your app in real-time.",
  keywords: [
    "AI app builder",
    "code generator",
    "web app",
    "React",
    "Next.js",
    "VibeCode",
  ],
  openGraph: {
    title: "VibeCode — AI-Powered App Builder",
    description:
      "Describe your vision and watch VibeCode generate your app in real-time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full dark`}>
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        <AuthProvider>
          <ToastProvider>
            <ClientShell />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
