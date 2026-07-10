"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, User as UserIcon, Settings, LogOut, Command } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { getInitials } from "@/lib/auth";
import DropdownMenu, {
  DropdownItem,
  DropdownDivider,
} from "@/components/ui/DropdownMenu";
import Button from "@/components/ui/Button";

/* ─── Animated VibeCode Logo ──────────────────────────────────── */
function VibeLogo() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VibeCode logo"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff2d6b" />
          <stop offset="100%" stopColor="#e91e8c" />
        </linearGradient>
        <filter id="logo-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background rounded square */}
      <rect width="36" height="36" rx="10" fill="url(#logo-grad)" />

      {/* Left bracket */}
      <g style={{ animation: "logo-bracket-left 2.5s ease-in-out infinite" }}>
        <path
          d="M10 11 L7 18 L10 25"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Right bracket */}
      <g style={{ animation: "logo-bracket-right 2.5s ease-in-out infinite" }}>
        <path
          d="M26 11 L29 18 L26 25"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Center slash */}
      <path
        d="M20.5 11 L15.5 25"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Pulsing dot — top right */}
      <circle
        cx="27"
        cy="9"
        r="3"
        fill="#ff5f8a"
        style={{ animation: "logo-pulse 2s ease-in-out infinite" }}
        filter="url(#logo-glow)"
      />
    </svg>
  );
}

/* ─── Navbar Component ────────────────────────────────────────── */
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-40
        transition-all duration-300
        ${
          scrolled
            ? "glass-strong shadow-[var(--shadow-sm)] py-3"
            : "bg-transparent py-4"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* ── Logo + Brand ── */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 group cursor-pointer"
          aria-label="VibeCode home"
        >
          <div
            className="transition-transform duration-300 group-hover:scale-105"
            style={{ filter: "drop-shadow(0 0 8px rgba(255,45,107,0.4))" }}
          >
            <VibeLogo />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-[var(--text-primary)]">Vibe</span>
            <span className="gradient-text">Code</span>
          </span>
        </button>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-3">
          {/* Ctrl+K shortcut hint */}
          <button
            onClick={() => {
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
              );
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/[0.04] border border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-hover)] transition-all text-xs cursor-pointer"
          >
            <Command size={12} />
            <span className="font-medium">Ctrl+K</span>
          </button>

          {user ? (
            <DropdownMenu
              trigger={
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-magenta)] flex items-center justify-center text-white text-xs font-bold shadow-[0_0_12px_rgba(255,45,107,0.3)]">
                    {getInitials(user.name)}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)] hidden lg:block">
                    {user.name}
                  </span>
                </div>
              }
            >
              <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {user.name}
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {user.email}
                </p>
              </div>
              <DropdownItem
                icon={<UserIcon size={14} />}
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </DropdownItem>
              <DropdownItem icon={<Settings size={14} />}>
                Settings
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
                icon={<LogOut size={14} />}
                danger
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
              >
                Log out
              </DropdownItem>
            </DropdownMenu>
          ) : (
            <>
              <button
                onClick={() => router.push("/signin")}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer font-semibold"
              >
                Log in
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="btn-pink px-5 py-2 rounded-full text-sm font-semibold cursor-pointer"
              >
                Sign up
              </button>
            </>
          )}
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden glass-strong mt-2 mx-4 rounded-2xl p-4 animate-slide-in-down">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-2 py-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-magenta)] flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(user.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  router.push("/dashboard");
                  setMobileOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={async () => {
                  await logout();
                  router.push("/");
                  setMobileOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-[var(--accent-pink)] hover:bg-[var(--accent-pink)]/10 rounded-lg transition-colors cursor-pointer"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  router.push("/signin");
                  setMobileOpen(false);
                }}
                className="w-full py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  router.push("/signup");
                  setMobileOpen(false);
                }}
                className="btn-pink w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
