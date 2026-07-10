"use client";

import { useEffect, useRef } from "react";

/* ─── Types ──────────────────────────────────────────────────── */
interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  initials: string;
  avatarGrad: string;
}

/* ─── Data ───────────────────────────────────────────────────── */
const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Engineer",
    company: "Vercel",
    text: "VibeCode is absolutely mind-blowing. I shipped a full dashboard in 20 minutes that would've taken me two days. The AI understands exactly what I mean.",
    rating: 5,
    initials: "SC",
    avatarGrad: "from-[#ff2d6b] to-[#e91e8c]",
  },
  {
    name: "Marcus Johnson",
    role: "Indie Hacker",
    company: "Self-employed",
    text: "I'm not even a developer and I built my SaaS landing page with VibeCode in an hour. The quality is production-ready, not just a prototype.",
    rating: 5,
    initials: "MJ",
    avatarGrad: "from-[#6366f1] to-[#7c3aed]",
  },
  {
    name: "Priya Patel",
    role: "Product Manager",
    company: "Stripe",
    text: "Finally a tool that bridges the gap between design and development. I can now prototype ideas for my engineering team in real-time.",
    rating: 5,
    initials: "PP",
    avatarGrad: "from-[#14b8a6] to-[#059669]",
  },
  {
    name: "Alex Rivera",
    role: "Full-Stack Developer",
    company: "Shopify",
    text: "The code quality from VibeCode surprised me. It actually uses best practices, proper component structure, and clean TypeScript. Not the usual garbage.",
    rating: 5,
    initials: "AR",
    avatarGrad: "from-[#f59e0b] to-[#ef4444]",
  },
  {
    name: "Emma Watson",
    role: "UX Designer",
    company: "Figma",
    text: "As a designer, I always struggled to turn my Figma mockups into code. VibeCode gets it right 90% of the time on the first try. Revolutionary.",
    rating: 5,
    initials: "EW",
    avatarGrad: "from-[#38bdf8] to-[#6366f1]",
  },
  {
    name: "David Kim",
    role: "CTO",
    company: "YC W24 Startup",
    text: "We built our entire MVP demo with VibeCode for our YC interview. We got in. Couldn't have iterated that fast with traditional development.",
    rating: 5,
    initials: "DK",
    avatarGrad: "from-[#e91e8c] to-[#7c3aed]",
  },
];

/* ─── Star Rating ─────────────────────────────────────────────── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? "var(--accent-pink)" : "rgba(255,255,255,0.1)"}
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────── */
function Avatar({ initials, grad }: { initials: string; grad: string }) {
  return (
    <div
      className={`w-11 h-11 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-[0_0_12px_rgba(255,45,107,0.2)]`}
    >
      {initials}
    </div>
  );
}

/* ─── Single Card ─────────────────────────────────────────────── */
function TestimonialCard({
  t,
  delay,
}: {
  t: Testimonial;
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="
        scroll-reveal
        relative rounded-2xl p-6
        bg-[var(--bg-card)] border border-[var(--border-subtle)]
        hover:border-[rgba(255,45,107,0.25)]
        card-hover-lift
        overflow-hidden
        group
      "
    >
      {/* Quote mark decoration */}
      <span
        className="absolute top-4 right-5 text-6xl font-serif leading-none text-[rgba(255,45,107,0.06)] select-none"
        aria-hidden
      >
        "
      </span>

      {/* Stars */}
      <Stars count={t.rating} />

      {/* Quote text */}
      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-300">
        "{t.text}"
      </p>

      {/* Author */}
      <div className="mt-5 flex items-center gap-3">
        <Avatar initials={t.initials} grad={t.avatarGrad} />
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {t.name}
          </p>
          <p className="text-xs text-[var(--text-tertiary)]">
            {t.role} · {t.company}
          </p>
        </div>
      </div>

      {/* Bottom pink glow on hover */}
      <div
        className="absolute inset-x-0 bottom-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--accent-pink), transparent)",
        }}
      />
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────── */
export default function TestimonialsSection() {
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto mt-28 px-4">
      {/* ── Section Header ── */}
      <div ref={headRef} className="text-center mb-14 scroll-reveal">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-pink)] mb-3">
          Loved by builders
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] text-balance">
          Thousands of devs trust VibeCode
        </h2>
        <p className="mt-4 text-base text-[var(--text-secondary)] max-w-xl mx-auto">
          From indie hackers to senior engineers at top companies — here's what
          they're saying.
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-10 mt-8">
          {[
            { val: "50K+", label: "Projects built" },
            { val: "4.9★", label: "Average rating" },
            { val: "120+", label: "Countries" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold gradient-text">{s.val}</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Card Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} t={t} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}
