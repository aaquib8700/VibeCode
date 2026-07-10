"use client";

import { useEffect, useState } from "react";
import TechFloaters from "./TechFloaters";

const ROTATING_WORDS = ["seconds", "magic", "VibeCode", "AI"];

export default function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx((p) => (p + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(cycle);
  }, []);

  return (
    /*
      Outer wrapper is wide — xl:max-w-7xl — so TechFloaters (absolute positioned)
      sit in the side gutters beside the centered text content (max-w-3xl).
      On smaller screens the floaters are hidden (xl:flex only).
    */
    <div className="relative w-full max-w-7xl mx-auto px-4">
      {/* Side floater columns — absolutely positioned in left/right gutters */}
      <TechFloaters />

      {/* Center content — constrained so floaters never overlap */}
      <div className="text-center max-w-3xl mx-auto">

        {/* ── Badge ── */}
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border"
            style={{
              background: "rgba(255,45,107,0.07)",
              borderColor: "rgba(255,45,107,0.2)",
              color: "var(--accent-pink)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--accent-pink)] animate-glow-pulse-pink"
              style={{ display: "inline-block" }}
            />
            For developers everywhere
          </span>
        </div>

        {/* ── Headline ── */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-balance">
            <span className="text-[var(--text-primary)]">The AI builder where</span>
            <br />
            <span className="text-[var(--text-primary)]">ideas become </span>
            <span
              className="gradient-text relative inline-block italic"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              {ROTATING_WORDS[wordIdx]}
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-magenta)] opacity-60" />
            </span>
            <span className="text-[var(--accent-pink)]">.</span>
          </h1>

          {/* ── Subtitle ── */}
          <p
            className="mt-7 text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.18s" }}
          >
            Describe your vision and watch VibeCode generate, style, and preview
            your full-stack application in real-time.{" "}
            <span className="text-[var(--text-primary)] font-semibold">
              No coding required.
            </span>
          </p>
        </div>

        {/* ── Powered-by strip ── */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mt-10 opacity-40 animate-fade-in-up"
          style={{ animationDelay: "0.28s" }}
        >
          {["OpenAI", "React", "Next.js", "Tailwind", "PostgreSQL"].map((t, i, arr) => (
            <span key={t} className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[var(--text-secondary)] whitespace-nowrap">
                {t}
              </span>
              {i < arr.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]" />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
