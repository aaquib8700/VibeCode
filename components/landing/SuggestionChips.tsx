"use client";

/*
 ExamplePromptCards — 6 cards with REALISTIC CSS website preview thumbnails
 Each thumbnail simulates the actual UI of the website being cloned.
 Light theme, matches reference image 2 aesthetic.
*/

interface ExampleCard {
  label: string;
  prompt: string;
  preview: React.ReactNode;
  tag: string;
  tagBg: string;
  tagText: string;
}

/* ── Website Preview Thumbnails (CSS-only, realistic) ──────────── */

function NetflixPreview() {
  return (
    <div className="w-full h-40 rounded-xl overflow-hidden relative bg-[#141414] flex flex-col">
      {/* Nav */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
        <span className="text-[#e50914] font-extrabold text-sm tracking-tight">NETFLIX</span>
        <div className="flex gap-1.5">
          {["Kids","Shows","Movies"].map(t=>(
            <span key={t} className="text-white/70 text-[7px]">{t}</span>
          ))}
        </div>
      </div>
      {/* Hero image area */}
      <div className="flex-1 bg-gradient-to-r from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center px-4 pt-6">
        <div className="flex-1">
          <div className="h-2 w-16 bg-white/90 rounded mb-1.5" />
          <div className="h-1.5 w-24 bg-white/50 rounded mb-3" />
          <div className="flex gap-1.5">
            <div className="px-2.5 py-1 bg-[#e50914] rounded-sm text-[7px] text-white font-bold">▶ Play</div>
            <div className="px-2.5 py-1 bg-white/20 rounded-sm text-[7px] text-white">More Info</div>
          </div>
        </div>
      </div>
      {/* Row of thumbnails */}
      <div className="flex gap-1.5 px-3 pb-2 pt-1">
        {["from-red-900 to-red-700","from-blue-900 to-blue-700","from-purple-900 to-purple-700","from-gray-800 to-gray-600"].map((g,i)=>(
          <div key={i} className={`flex-1 h-7 rounded bg-gradient-to-br ${g} opacity-90`} />
        ))}
      </div>
    </div>
  );
}

function SpotifyPreview() {
  return (
    <div className="w-full h-40 rounded-xl overflow-hidden relative flex bg-[#121212]">
      {/* Left sidebar */}
      <div className="w-14 bg-black flex flex-col items-center py-2 gap-2 flex-shrink-0">
        <div className="w-6 h-6 rounded-full bg-[#1db954] flex items-center justify-center">
          <span className="text-black text-[8px] font-extrabold">♪</span>
        </div>
        {["🏠","🔍","📚"].map((e,i)=>(
          <span key={i} className="text-xs">{e}</span>
        ))}
        <div className="mt-auto mb-1 w-7 h-7 rounded bg-[#333]" />
      </div>
      {/* Main area */}
      <div className="flex-1 px-2 py-2 overflow-hidden">
        <div className="text-[7px] text-white/40 mb-1">GOOD EVENING</div>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {[["bg-purple-700","Liked Songs"],["bg-blue-700","Discover"],["bg-red-700","Top Hits"],["bg-green-700","Chill Mix"]].map(([c,l],i)=>(
            <div key={i} className={`${c} rounded flex items-center gap-1 px-1 py-1`}>
              <div className="w-4 h-4 rounded-sm bg-white/20 flex-shrink-0"/>
              <span className="text-[6px] text-white font-bold truncate">{l}</span>
            </div>
          ))}
        </div>
        <div className="text-[7px] text-white/40 mb-1">Featured Charts</div>
        <div className="flex gap-1">
          {["bg-gradient-to-br from-[#1db954] to-[#0d7c3a]","bg-gradient-to-br from-blue-600 to-blue-900","bg-gradient-to-br from-orange-500 to-red-600"].map((g,i)=>(
            <div key={i} className={`${g} flex-1 h-10 rounded-lg`}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function AirbnbPreview() {
  return (
    <div className="w-full h-40 rounded-xl overflow-hidden bg-white flex flex-col">
      {/* Nav */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <span className="text-[#ff5a5f] font-extrabold text-xs">airbnb</span>
        <div className="flex items-center gap-1 border border-gray-200 rounded-full px-2 py-1 shadow-sm">
          <span className="text-[7px] text-gray-700">Anywhere</span>
          <span className="w-[1px] h-3 bg-gray-200 mx-0.5"/>
          <span className="text-[7px] text-gray-700">Any week</span>
          <div className="w-4 h-4 rounded-full bg-[#ff5a5f] flex items-center justify-center ml-1">
            <span className="text-white text-[8px]">🔍</span>
          </div>
        </div>
        <div className="w-5 h-5 rounded-full bg-gray-200"/>
      </div>
      {/* Category chips */}
      <div className="flex gap-2 px-3 py-1.5 overflow-hidden">
        {["🏠 Rooms","🏖️ Beach","🏔️ Mountain","🏙️ City","🌊 Lakefront"].map((c,i)=>(
          <span key={i} className={`text-[7px] whitespace-nowrap flex items-center gap-0.5 pb-1 ${i===0 ? "border-b-2 border-gray-900 text-gray-900 font-semibold" : "text-gray-500"}`}>{c}</span>
        ))}
      </div>
      {/* Property grid */}
      <div className="grid grid-cols-3 gap-1.5 px-3 pb-2 flex-1">
        {[
          ["from-orange-200 to-orange-300","Malibu, CA","$180/night"],
          ["from-blue-200 to-blue-300","Miami, FL","$220/night"],
          ["from-green-200 to-green-300","Aspen, CO","$350/night"],
        ].map(([g,loc,price],i)=>(
          <div key={i} className="flex flex-col gap-0.5">
            <div className={`bg-gradient-to-br ${g} rounded-lg h-12`}/>
            <span className="text-[6px] font-semibold text-gray-800">{loc}</span>
            <span className="text-[6px] text-gray-500">{price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscordPreview() {
  return (
    <div className="w-full h-40 rounded-xl overflow-hidden flex bg-[#313338]">
      {/* Server list */}
      <div className="w-10 bg-[#1e1f22] flex flex-col items-center py-2 gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-[14px] hover:rounded-xl bg-[#5865f2] flex items-center justify-center transition-all">
          <span className="text-white text-[9px] font-bold">V</span>
        </div>
        <div className="w-4 border-t border-white/10"/>
        {["🎮","🎨","📚"].map((e,i)=>(
          <div key={i} className="w-7 h-7 rounded-full bg-[#313338] flex items-center justify-center text-[9px]">{e}</div>
        ))}
      </div>
      {/* Channel sidebar */}
      <div className="w-24 bg-[#2b2d31] flex flex-col pt-2 flex-shrink-0">
        <div className="px-2 text-[7px] text-white font-bold mb-2">VibeCode Server</div>
        <div className="text-[6px] text-white/40 px-2 mb-1 uppercase tracking-wide">Text Channels</div>
        {["# general","# dev-talk","# showcase","# help"].map((ch,i)=>(
          <div key={i} className={`px-2 py-1 text-[7px] ${i===0 ? "bg-white/10 text-white" : "text-white/50"} rounded mx-1 mb-0.5`}>{ch}</div>
        ))}
        <div className="text-[6px] text-white/40 px-2 mb-1 mt-2 uppercase tracking-wide">Voice</div>
        <div className="px-2 py-1 text-[7px] text-white/50">🔊 General</div>
      </div>
      {/* Chat area */}
      <div className="flex-1 flex flex-col p-2">
        <div className="flex-1 space-y-2">
          {[["MJ","Hey everyone! 👋","bg-indigo-500"],["SC","Welcome! Love this app","bg-pink-500"],["AR","Just shipped v2.0 🚀","bg-teal-500"]].map(([init,msg,bg],i)=>(
            <div key={i} className="flex gap-1.5 items-start">
              <div className={`w-5 h-5 rounded-full ${bg} flex items-center justify-center text-white text-[7px] font-bold flex-shrink-0`}>{init}</div>
              <div>
                <div className="text-[6px] text-white/40 mb-0.5">{init==="MJ"?"Marcus":"Sarah"}</div>
                <div className="text-[7px] text-white/80">{msg}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto bg-[#383a40] rounded-lg px-2 py-1.5 flex items-center gap-1">
          <span className="text-[7px] text-white/30 flex-1">Message #general</span>
          <span className="text-[9px]">😀</span>
        </div>
      </div>
    </div>
  );
}

function GitHubPreview() {
  return (
    <div className="w-full h-40 rounded-xl overflow-hidden bg-[#0d1117] flex flex-col">
      {/* Nav */}
      <div className="bg-[#161b22] flex items-center gap-2 px-3 py-2 border-b border-white/10">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="white"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        <span className="text-white/60 text-[7px]">aaquib8700 / VibeCode</span>
      </div>
      {/* Profile + contribution graph */}
      <div className="flex flex-1 p-2 gap-2">
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"/>
          <span className="text-white text-[7px] font-bold">aaquib8700</span>
          <div className="px-2 py-0.5 border border-white/20 rounded-md text-[6px] text-white/60">Follow</div>
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <span className="text-white/40 text-[6px]">132 contributions in the last year</span>
          <div className="grid grid-cols-12 gap-0.5">
            {Array.from({length:60}).map((_,i)=>(
              <div key={i} className="w-2 h-2 rounded-sm" style={{background: i%7===0?"#39d353":i%3===0?"#26a641":i%5===0?"#006d32":"#161b22"}}/>
            ))}
          </div>
          <div className="flex gap-1 mt-1 flex-wrap">
            {["VibeCode","react-dashboard","next-starter"].map(r=>(
              <div key={r} className="border border-white/10 rounded px-1.5 py-0.5 text-[6px] text-white/60">{r}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplePreview() {
  return (
    <div className="w-full h-40 rounded-xl overflow-hidden bg-white flex flex-col">
      {/* Apple nav */}
      <div className="bg-white/80 backdrop-blur flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <svg viewBox="0 0 814 1000" width="12" height="12" fill="#111"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 326.8 0 238.8 0 159.4 0 71.4 69.1 10.9 155.5 10.9c75.9 0 130.3 49.5 177.5 49.5 44.4 0 107.7-52.3 192.5-52.3 28.3 0 130.3 2.6 197.4 99.7zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
        <div className="flex gap-3">
          {["Store","Mac","iPad","iPhone"].map(t=>(
            <span key={t} className="text-[7px] text-gray-700">{t}</span>
          ))}
        </div>
        <div className="flex gap-2 text-[9px]">🔍 🛍️</div>
      </div>
      {/* Hero area */}
      <div className="flex-1 bg-[#f5f5f7] flex flex-col items-center justify-center px-4 py-3 text-center relative overflow-hidden">
        <div className="w-20 h-14 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 rounded-2xl mb-2 shadow-lg" style={{transform:"perspective(200px) rotateX(5deg)"}}>
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-black/5 to-transparent"/>
        </div>
        <span className="text-[7px] text-[#6e6e73] uppercase tracking-widest">MacBook Pro</span>
        <span className="text-sm font-semibold text-gray-900 leading-tight">Oh so pro.</span>
        <div className="flex gap-3 mt-1.5">
          <span className="text-[7px] text-[#0066cc] font-medium">Learn more ›</span>
          <span className="text-[7px] text-[#0066cc] font-medium">Shop ›</span>
        </div>
      </div>
    </div>
  );
}

interface ExampleCard {
  label: string;
  prompt: string;
  preview: React.ReactNode;
  tag: string;
  tagBg: string;
  tagText: string;
  cardBg: string;
}

/* ── Cards data ────────────────────────────────────────────── */
const EXAMPLES: ExampleCard[] = [
  {
    label: "Build a Netflix Clone",
    prompt: "Build a Netflix clone with dark theme, hero banner, movie categories, hover cards, and a streaming UI",
    preview: <NetflixPreview />,
    tag: "Streaming",
    tagBg: "rgba(229,9,20,0.1)",
    tagText: "#e50914",
    cardBg: "#ffe8e8", // Soft red (slightly darker)
  },
  {
    label: "Create a Spotify Landing Page",
    prompt: "Create a Spotify landing page with dark theme, green accents, music player UI, and featured playlists",
    preview: <SpotifyPreview />,
    tag: "Music",
    tagBg: "rgba(29,185,84,0.12)",
    tagText: "#1db954",
    cardBg: "#eafaf0", // Soft green (slightly darker)
  },
  {
    label: "Build an Airbnb Clone",
    prompt: "Build an Airbnb clone with property listings, search filters, map view, and booking cards",
    preview: <AirbnbPreview />,
    tag: "Travel",
    tagBg: "rgba(255,90,95,0.1)",
    tagText: "#ff5a5f",
    cardBg: "#ffebee", // Soft coral/pink (slightly darker)
  },
  {
    label: "Design a Discord Dashboard",
    prompt: "Design a Discord-style dashboard with dark sidebar, server channels, message feed, and member list",
    preview: <DiscordPreview />,
    tag: "Community",
    tagBg: "rgba(88,101,242,0.1)",
    tagText: "#5865f2",
    cardBg: "#ebeffd", // Soft purple/indigo (slightly darker)
  },
  {
    label: "Create a GitHub Profile Page",
    prompt: "Create a stunning GitHub profile page with contribution graph, pinned repos, stats, and dark mode",
    preview: <GitHubPreview />,
    tag: "Dev Tools",
    tagBg: "rgba(0,0,0,0.06)",
    tagText: "#555555",
    cardBg: "#e9ebf0", // Soft graphite/slate (slightly darker)
  },
  {
    label: "Build an Apple Landing Page",
    prompt: "Build an Apple-style product landing page with hero animation, product showcase, and minimal design",
    preview: <ApplePreview />,
    tag: "Product",
    tagBg: "rgba(0,0,0,0.05)",
    tagText: "#888888",
    cardBg: "#f4f4f4", // Soft silver/gray (slightly darker)
  },
];

/* ── Props ─────────────────────────────────────────────────── */
interface SuggestionChipsProps {
  onSelect: (prompt: string) => void;
}

export default function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <section className="w-full max-w-6xl mx-auto mt-20 px-4">
      {/* ── Header ── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-pink)] mb-2">
            Quick start
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            A glimpse at what you can build
          </h2>
        </div>
        <button
          className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[var(--accent-pink)] hover:gap-3 transition-all duration-200 cursor-pointer group"
        >
          Browse all examples
          <span className="w-7 h-7 rounded-full bg-[var(--accent-pink)] text-white flex items-center justify-center text-xs group-hover:shadow-[0_0_12px_rgba(255,45,107,0.35)] transition-shadow">
            →
          </span>
        </button>
      </div>

      {/* ── Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => onSelect(ex.prompt)}
            className="
              group relative text-left rounded-2xl p-3 overflow-hidden
              border border-[var(--border-subtle)]
              hover:border-[rgba(255,45,107,0.25)]
              card-hover-lift
              cursor-pointer
              transition-colors duration-300
              shadow-[var(--shadow-card)]
              hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
            "
            style={{ backgroundColor: ex.cardBg }}
          >
            {/* Preview thumbnail */}
            <div className="overflow-hidden rounded-xl">
              {ex.preview}
            </div>

            {/* Info */}
            <div className="mt-3 px-1 pb-1">
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: ex.tagBg, color: ex.tagText }}
                >
                  {ex.tag}
                </span>
                <span className="text-[var(--text-tertiary)] text-xs group-hover:text-[var(--accent-pink)] group-hover:translate-x-1 transition-all duration-200">
                  →
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-pink)] transition-colors duration-200 leading-snug">
                {ex.label}
              </p>
            </div>

            {/* Bottom pink glow line on hover */}
            <div
              className="absolute inset-x-0 bottom-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(to right, transparent, var(--accent-pink), transparent)",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
