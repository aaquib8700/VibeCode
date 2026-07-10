"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type ConfettiDotProps = {
  style: React.CSSProperties;
  shape?: "circle" | "square";
};

function ConfettiDot({ style, shape = "circle" }: ConfettiDotProps) {
  return (
    <div
      className="absolute"
      style={{ ...style, borderRadius: shape === "circle" ? "50%" : "3px" }}
    />
  );
}

const CONFETTI = [
  { style: { top: "12%", left: "14%", width: 10, height: 10, background: "#ff2d6b", animation: "confetti-float-1 4s ease-in-out infinite" } },
  { style: { top: "18%", left: "30%", width: 8, height: 8, background: "#f59e0b", animation: "confetti-float-2 5s ease-in-out infinite" } },
  { style: { top: "8%", right: "16%", width: 12, height: 12, background: "#22d3ee", animation: "confetti-float-3 3.5s ease-in-out infinite" } },
  { style: { top: "22%", right: "28%", width: 7, height: 7, background: "#a78bfa", animation: "confetti-float-1 4.5s ease-in-out 1s infinite" } },
  { style: { top: "14%", left: "48%", width: 6, height: 6, background: "#34d399", animation: "confetti-float-2 3.8s ease-in-out 0.5s infinite" } },
  { style: { top: "28%", left: "8%", width: 9, height: 9, background: "#fb923c", animation: "confetti-float-3 4.2s ease-in-out 1.5s infinite" } },
  { style: { top: "10%", right: "10%", width: 8, height: 8, background: "#f472b6", animation: "confetti-float-1 5.5s ease-in-out 2s infinite" } },
];

export default function CTASection() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("revealed"); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto mt-28 px-4 pb-24">
      <div
        ref={ref}
        className="scroll-reveal relative rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center py-24 px-6"
        style={{
          background: "linear-gradient(135deg, #1a0a2e 0%, #2d0d40 40%, #0f0a1a 100%)",
          boxShadow: "0 8px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Background orbs */}
        <div className="absolute w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(255,45,107,0.5), transparent 70%)", top: "-20%", left: "-10%", animation: "mesh-move-1 18s ease-in-out infinite" }}
        />
        <div className="absolute w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.5), transparent 70%)", bottom: "-15%", right: "-8%", animation: "mesh-move-2 22s ease-in-out infinite" }}
        />

        {/* Confetti dots */}
        {CONFETTI.map((c, i) => <ConfettiDot key={i} style={c.style} />)}

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] text-balance mb-6">
            Ready to build your{" "}
            <span className="gradient-text">next project?</span>
          </h2>
          <p className="text-base sm:text-lg text-white/60 max-w-lg mx-auto mb-10">
            Join thousands of developers who use VibeCode to ship beautiful apps faster than ever before.
          </p>
          <button
            onClick={() => router.push("/signup")}
            id="cta-get-started-btn"
            className="btn-pink inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold"
          >
            Get started for free
            <span className="text-lg">→</span>
          </button>
          <p className="mt-5 text-xs text-white/30">
            No credit card required · Free tier available · Ship in minutes
          </p>
        </div>
      </div>
    </section>
  );
}
