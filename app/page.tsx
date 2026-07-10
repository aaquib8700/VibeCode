"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import HeroSection from "@/components/landing/HeroSection";
import PromptInput from "@/components/landing/PromptInput";
import SuggestionChips from "@/components/landing/SuggestionChips";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTASection from "@/components/landing/CTASection";
import FooterSection from "@/components/landing/FooterSection";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastContext";
import { generateProject } from "@/lib/api";

export default function Home() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  /* ── Handlers (backend untouched) ── */
  async function handleSubmit(prompt: string) {
    if (!user) {
      addToast("info", "Sign in to start building with AI.");
      router.push("/signin");
      return;
    }

    setGenerating(true);
    try {
      const res = await generateProject(prompt);
      if (res.success && res.data) {
        addToast("success", "Project generation started!");
        router.push(`/builder/${res.data.id}`);
      } else {
        addToast("error", res.message || "Failed to generate project.");
      }
    } catch {
      addToast("error", "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function handleSuggestionSelect(prompt: string) {
    handleSubmit(prompt);
  }

  return (
    <div className="min-h-screen relative flex flex-col bg-white">
      {/* Fixed animated background */}
      <AnimatedBackground />

      {/* Navbar */}
      <Navbar />

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col items-center pt-28 pb-10 px-4 relative z-10">

        {/* Hero section */}
        <HeroSection />

        {/* Prompt input */}
        <div className="mt-12 w-full flex justify-center">
          <PromptInput
            onSubmit={handleSubmit}
            loading={generating}
          />
        </div>

        {/* Example prompt cards — NO Testimonials section */}
        <SuggestionChips onSelect={handleSuggestionSelect} />

        {/* Features bento grid */}
        <FeaturesSection />

        {/* CTA */}
        <CTASection />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
