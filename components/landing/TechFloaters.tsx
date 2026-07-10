"use client";

/*
 TechFloaters — Professional coding tech icons that float in TWO
 SIDE COLUMNS beside the hero heading, never overlapping the text.
 Colors are darkened slightly to provide optimal visual contrast on white background.
*/

interface TechPill {
  id: string;
  name: string;
  color: string;           /* icon accent color */
  bgColor: string;         /* pill background */
  borderColor: string;     /* pill border */
  glowColor: string;
  icon: React.ReactNode;
  side: "left" | "right";
  delay: string;
  floatClass: string;
}

/* ── Brand SVG Icons (slightly darker for contrast) ─────────── */

function ReactIcon() {
  return (
    <svg viewBox="0 0 40 40" width="26" height="26" fill="none">
      <circle cx="20" cy="20" r="3.5" fill="#0284c7"/>
      <ellipse cx="20" cy="20" rx="16" ry="6.5" stroke="#0284c7" strokeWidth="1.8" fill="none" opacity="0.8"/>
      <ellipse cx="20" cy="20" rx="16" ry="6.5" stroke="#0284c7" strokeWidth="1.8" fill="none" opacity="0.8"
        transform="rotate(60 20 20)"/>
      <ellipse cx="20" cy="20" rx="16" ry="6.5" stroke="#0284c7" strokeWidth="1.8" fill="none" opacity="0.8"
        transform="rotate(120 20 20)"/>
    </svg>
  );
}

function NodeIcon() {
  return (
    <svg viewBox="0 0 40 40" width="26" height="26" fill="none">
      <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" fill="rgba(22,101,52,0.12)" stroke="#166534" strokeWidth="1.8"/>
      <text x="12" y="25" fontSize="9" fontWeight="bold" fill="#166534" fontFamily="monospace">JS</text>
      <circle cx="28" cy="14" r="3" fill="#166534" opacity="0.7"/>
    </svg>
  );
}

function JavaScriptIcon() {
  return (
    <svg viewBox="0 0 40 40" width="26" height="26" fill="none">
      <rect x="4" y="4" width="32" height="32" rx="5" fill="rgba(180,83,9,0.12)" stroke="#b45309" strokeWidth="1.5"/>
      <text x="9" y="27" fontSize="14" fontWeight="bold" fill="#b45309" fontFamily="monospace">JS</text>
    </svg>
  );
}

function GitIcon() {
  return (
    <svg viewBox="0 0 40 40" width="26" height="26" fill="none">
      <circle cx="28" cy="12" r="4" fill="rgba(194,65,12,0.15)" stroke="#c2410c" strokeWidth="1.8"/>
      <circle cx="12" cy="28" r="4" fill="rgba(194,65,12,0.15)" stroke="#c2410c" strokeWidth="1.8"/>
      <circle cx="28" cy="28" r="4" fill="rgba(194,65,12,0.15)" stroke="#c2410c" strokeWidth="1.8"/>
      <line x1="12" y1="28" x2="28" y2="28" stroke="#c2410c" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="28" y1="12" x2="28" y2="28" stroke="#c2410c" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="12" y1="28" x2="24" y2="16" stroke="#c2410c" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function TypeScriptIcon() {
  return (
    <svg viewBox="0 0 40 40" width="26" height="26" fill="none">
      <rect x="4" y="4" width="32" height="32" rx="5" fill="rgba(29,78,216,0.12)" stroke="#1d4ed8" strokeWidth="1.5"/>
      <text x="8" y="26" fontSize="12" fontWeight="bold" fill="#1d4ed8" fontFamily="monospace">TS</text>
    </svg>
  );
}

function NextjsIcon() {
  return (
    <svg viewBox="0 0 40 40" width="26" height="26" fill="none">
      <circle cx="20" cy="20" r="15" fill="rgba(0,0,0,0.08)" stroke="#111111" strokeWidth="1.8"/>
      <text x="11" y="26" fontSize="11" fontWeight="900" fill="#111111" fontFamily="sans-serif">N</text>
      <line x1="22" y1="13" x2="32" y2="28" stroke="#111111" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function TailwindIcon() {
  return (
    <svg viewBox="0 0 40 40" width="26" height="26" fill="none">
      <path
        d="M10 20 C12 14 17 11 20 14 C23 11 28 8 30 14 C27 14 25 17 22 20 C25 20 27 23 30 26 C27 32 22 35 20 26 C17 29 12 32 10 26 C13 26 15 23 18 20 C15 20 13 17 10 20Z"
        fill="rgba(15,118,110,0.15)" stroke="#0f766e" strokeWidth="1.5"
      />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg viewBox="0 0 40 40" width="26" height="26" fill="none">
      <ellipse cx="20" cy="11" rx="13" ry="5" fill="rgba(180,83,9,0.15)" stroke="#b45309" strokeWidth="1.8"/>
      <path d="M7 11 L7 29 C7 31.8 13 34 20 34 C27 34 33 31.8 33 29 L33 11" stroke="#b45309" strokeWidth="1.8" fill="none"/>
      <path d="M7 18 C7 20.8 13 23 20 23 C27 23 33 20.8 33 18" stroke="#b45309" strokeWidth="1.5" strokeDasharray="3 2" fill="none"/>
    </svg>
  );
}

/* ── Pill data ──────────────────────────────────────────────── */
const LEFT_PILLS: TechPill[] = [
  {
    id: "react",
    name: "React",
    color: "#0284c7",
    bgColor: "rgba(2,132,199,0.06)",
    borderColor: "rgba(2,132,199,0.25)",
    glowColor: "rgba(2,132,199,0.15)",
    icon: <ReactIcon />,
    side: "left",
    delay: "0s",
    floatClass: "animate-tech-float",
  },
  {
    id: "nodejs",
    name: "Node.js",
    color: "#166534",
    bgColor: "rgba(22,101,52,0.06)",
    borderColor: "rgba(22,101,52,0.25)",
    glowColor: "rgba(22,101,52,0.15)",
    icon: <NodeIcon />,
    side: "left",
    delay: "1.2s",
    floatClass: "animate-tech-float-alt",
  },
  {
    id: "javascript",
    name: "JavaScript",
    color: "#b45309",
    bgColor: "rgba(180,83,9,0.06)",
    borderColor: "rgba(180,83,9,0.28)",
    glowColor: "rgba(180,83,9,0.15)",
    icon: <JavaScriptIcon />,
    side: "left",
    delay: "2.4s",
    floatClass: "animate-tech-float",
  },
  {
    id: "git",
    name: "Git",
    color: "#c2410c",
    bgColor: "rgba(194,65,12,0.06)",
    borderColor: "rgba(194,65,12,0.25)",
    glowColor: "rgba(194,65,12,0.15)",
    icon: <GitIcon />,
    side: "left",
    delay: "3.6s",
    floatClass: "animate-tech-float-alt",
  },
];

const RIGHT_PILLS: TechPill[] = [
  {
    id: "typescript",
    name: "TypeScript",
    color: "#1d4ed8",
    bgColor: "rgba(29,78,216,0.06)",
    borderColor: "rgba(29,78,216,0.25)",
    glowColor: "rgba(29,78,216,0.15)",
    icon: <TypeScriptIcon />,
    side: "right",
    delay: "0.6s",
    floatClass: "animate-tech-float-alt",
  },
  {
    id: "nextjs",
    name: "Next.js",
    color: "#111111",
    bgColor: "rgba(0,0,0,0.04)",
    borderColor: "rgba(0,0,0,0.14)",
    glowColor: "rgba(0,0,0,0.06)",
    icon: <NextjsIcon />,
    side: "right",
    delay: "1.8s",
    floatClass: "animate-tech-float",
  },
  {
    id: "tailwind",
    name: "Tailwind",
    color: "#0f766e",
    bgColor: "rgba(15,118,110,0.06)",
    borderColor: "rgba(15,118,110,0.25)",
    glowColor: "rgba(15,118,110,0.15)",
    icon: <TailwindIcon />,
    side: "right",
    delay: "3s",
    floatClass: "animate-tech-float-alt",
  },
  {
    id: "database",
    name: "Database",
    color: "#b45309",
    bgColor: "rgba(180,83,9,0.06)",
    borderColor: "rgba(180,83,9,0.25)",
    glowColor: "rgba(180,83,9,0.15)",
    icon: <DatabaseIcon />,
    side: "right",
    delay: "4.2s",
    floatClass: "animate-tech-float",
  },
];

/* ── Pill Component ──────────────────────────────────────────── */
function Pill({ pill }: { pill: TechPill }) {
  return (
    <div
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl select-none pointer-events-none ${pill.floatClass}`}
      style={{
        animationDelay: pill.delay,
        background: pill.bgColor,
        border: `1px solid ${pill.borderColor}`,
        boxShadow: `0 4px 16px ${pill.glowColor}, 0 0 0 1px ${pill.borderColor} inset`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        minWidth: "130px",
      }}
    >
      <div className="flex-shrink-0">{pill.icon}</div>
      <span
        className="text-sm font-semibold whitespace-nowrap"
        style={{ color: pill.color }}
      >
        {pill.name}
      </span>
    </div>
  );
}

/* ── Exported component — two side columns ───────────────────── */
export default function TechFloaters() {
  return (
    <>
      {/* LEFT column — stacked pills beside hero text */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 items-end pr-8" style={{ width: "200px" }}>
        {LEFT_PILLS.map((p) => (
          <Pill key={p.id} pill={p} />
        ))}
      </div>

      {/* RIGHT column — stacked pills beside hero text */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 items-start pl-8" style={{ width: "200px" }}>
        {RIGHT_PILLS.map((p) => (
          <Pill key={p.id} pill={p} />
        ))}
      </div>
    </>
  );
}
