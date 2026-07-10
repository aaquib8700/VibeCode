"use client";

import AnimatedBackground from "@/components/landing/AnimatedBackground";
import Navbar from "@/components/layout/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex flex-col">
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24 relative z-10">
        {children}
      </main>
    </div>
  );
}
