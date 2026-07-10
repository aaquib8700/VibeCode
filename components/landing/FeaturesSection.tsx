"use client";

import { useEffect, useRef } from "react";

/* ─── Scroll-reveal hook ──────────────────────────────────────── */
function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("revealed");
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

/* ─── Mini bar chart ──────────────────────────────────────────── */
function MiniChart() {
  const bars = [55, 80, 65, 90, 75, 95, 70];
  return (
    <div className="flex items-end gap-1.5 h-16">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{
            height: `${h}%`,
            background: i === 5 ? "#14b8a6" : "rgba(20,184,166,0.3)",
            animation: `fade-in-up 0.5s ease-out ${i * 0.06}s both`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Integration orb ─────────────────────────────────────────── */
const TECH_ICONS = [
  { emoji: "🤖", color: "#10a37f" },
  { emoji: "⚛️", color: "#61dafb" },
  { emoji: "🐙", color: "#333" },
  { emoji: "▲", color: "#333" },
  { emoji: "💳", color: "#635bff" },
  { emoji: "🎨", color: "#a259ff" },
];

function IntegrationOrb({ emoji, color, angle, radius }: { emoji: string; color: string; angle: number; radius: number }) {
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;
  return (
    <div
      className="absolute w-9 h-9 rounded-xl flex items-center justify-center text-sm bg-white border border-black/[0.07] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <span style={{ filter: `drop-shadow(0 0 3px ${color})` }}>{emoji}</span>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────── */
export default function FeaturesSection() {
  const headRef = useScrollReveal(0);
  const card1 = useScrollReveal(80);
  const card2 = useScrollReveal(160);
  const card3 = useScrollReveal(80);
  const card4 = useScrollReveal(160);
  const card5 = useScrollReveal(240);

  return (
    <section className="w-full max-w-6xl mx-auto mt-28 px-4">
      {/* ── Section Header ── */}
      <div ref={headRef} className="text-center mb-12 scroll-reveal">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-pink)] mb-3">
          Everything you need
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] text-balance">
          Build faster, ship smarter
        </h2>
        <p className="mt-4 text-base text-[var(--text-secondary)] max-w-lg mx-auto">
          VibeCode handles the entire stack — from beautiful UI to backend APIs —
          so you can focus on what matters.
        </p>
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* Card 1 — Pages in minutes (dark, 2-col) */}
        <div
          ref={card1}
          className="scroll-reveal lg:col-span-2 relative rounded-3xl overflow-hidden p-7 flex flex-col justify-between min-h-[220px] shadow-[0_4px_24px_rgba(0,0,0,0.10)]"
          style={{ background: "linear-gradient(135deg, #1a0a2e, #2a123e, #0f0f1a)" }}
        >
          <div>
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-white/10 text-white/60 mb-4">
              Pages
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Pages in minutes</h3>
            <p className="text-sm text-white/50 max-w-xs">
              Generate full, production-ready pages from a single prompt.
            </p>
          </div>
          <div className="absolute bottom-5 right-5 w-44 opacity-20 font-mono text-[10px] text-purple-300 space-y-0.5">
            <div>const App = () =&gt; {"{"}</div>
            <div>&nbsp;&nbsp;return &lt;Hero /&gt;;</div>
            <div>{"}"}</div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[1px]"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,45,107,0.5), transparent)" }}
          />
        </div>

        {/* Card 2 — Insights (teal, light card) */}
        <div
          ref={card2}
          className="scroll-reveal relative rounded-3xl overflow-hidden p-6 flex flex-col justify-between min-h-[220px] shadow-[var(--shadow-md)]"
          style={{ background: "#f0fdfa", border: "1px solid rgba(20,184,166,0.15)" }}
        >
          <div>
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest mb-4"
              style={{ background: "rgba(20,184,166,0.12)", color: "#0f766e" }}>
              Insights
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1">Understand everything</h3>
            <p className="text-xs text-gray-500 mb-4">Real-time analytics right inside your builder.</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-teal-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1 text-[10px] items-center text-teal-600">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-glow-pulse" />
                Live
              </div>
            </div>
            <MiniChart />
            <div className="flex justify-between mt-1">
              {["M","T","W","T","F","S","S"].map((d,i)=>(
                <span key={i} className="text-[9px] text-gray-400 flex-1 text-center">{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3 — Integrations (amber, light) */}
        <div
          ref={card3}
          className="scroll-reveal relative rounded-3xl overflow-hidden p-6 flex flex-col justify-between min-h-[220px] shadow-[var(--shadow-md)]"
          style={{ background: "#fffbeb", border: "1px solid rgba(245,158,11,0.15)" }}
        >
          <div className="relative h-28 flex items-center justify-center mb-2">
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}>
              <span className="text-xl">⚡</span>
            </div>
            {TECH_ICONS.map((ic, i) => (
              <IntegrationOrb key={i} emoji={ic.emoji} color={ic.color}
                angle={(360 / TECH_ICONS.length) * i - 90} radius={50} />
            ))}
          </div>
          <div>
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest mb-3"
              style={{ background: "rgba(245,158,11,0.12)", color: "#92400e" }}>
              Integrations
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1">Integrate with everything</h3>
            <p className="text-xs text-gray-500">Connect OpenAI, GitHub, Stripe & 30+ tools.</p>
          </div>
        </div>

        {/* Card 4 — Audience/Teams (lavender, light) */}
        <div
          ref={card4}
          className="scroll-reveal relative rounded-3xl overflow-hidden p-6 flex flex-col justify-between min-h-[220px] shadow-[var(--shadow-md)]"
          style={{ background: "#faf5ff", border: "1px solid rgba(167,139,250,0.15)" }}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { g: "from-pink-400 to-rose-500", i: "AR" },
              { g: "from-indigo-400 to-violet-500", i: "MJ" },
              { g: "from-teal-400 to-emerald-500", i: "SC" },
              { g: "from-amber-400 to-orange-500", i: "PP" },
              { g: "from-sky-400 to-blue-500", i: "EW" },
              { g: "from-fuchsia-400 to-pink-500", i: "DK" },
            ].map((a, i) => (
              <div key={i}
                className={`w-11 h-11 rounded-full bg-gradient-to-br ${a.g} flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm`}>
                {a.i}
              </div>
            ))}
          </div>
          <div>
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest mb-3"
              style={{ background: "rgba(139,92,246,0.1)", color: "#6d28d9" }}>
              Audience
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1">One hub for everyone</h3>
            <p className="text-xs text-gray-500">Collaborate, share, and review all in one workspace.</p>
          </div>
        </div>

        {/* Card 5 — Deploy (pink gradient) */}
        <div
          ref={card5}
          className="scroll-reveal relative rounded-3xl overflow-hidden p-6 flex flex-col justify-between min-h-[220px] shadow-[var(--shadow-pink)]"
          style={{ background: "linear-gradient(135deg, var(--accent-pink), var(--accent-magenta), #7c3aed)" }}
        >
          <div className="absolute top-4 right-4 grid grid-cols-4 gap-1 opacity-25">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full bg-white" />
            ))}
          </div>
          <div>
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest mb-4 bg-white/20 text-white">
              Deploy
            </span>
            <h3 className="text-2xl font-extrabold text-white mb-2">Ship in seconds</h3>
            <p className="text-sm text-white/75 max-w-[180px]">One-click deploy to Vercel, Netlify or your own infra.</p>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-2 rounded-full bg-white/20">
              <div className="h-2 rounded-full bg-white" style={{ width: "80%" }} />
            </div>
            <span className="text-xs text-white font-bold">80%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
