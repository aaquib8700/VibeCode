"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export default function PromptInput({
  onSubmit,
  loading = false,
  placeholder = "Describe the website you want to build…",
}: PromptInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    if (!value.trim() || loading) return;
    onSubmit(value.trim());
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }

  const isActive = focused || loading || value.trim().length > 0;

  return (
    <div
      className="w-full max-w-3xl mx-auto animate-fade-in-up"
      style={{ animationDelay: "0.25s" }}
    >
      {/* ── Outer glow ring (appears on focus / loading) ── */}
      <div
        className="relative rounded-3xl transition-all duration-500"
        style={{
          boxShadow: isActive
            ? "0 0 0 2.5px rgba(255,45,107,0.35), 0 20px 60px rgba(0,0,0,0.16)"
            : "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        {/* ── Animated gradient border ── */}
        <div
          className="absolute inset-0 rounded-3xl p-[1.5px] pointer-events-none"
          style={{
            background: isActive
              ? "linear-gradient(135deg, var(--accent-pink), var(--accent-magenta), var(--accent-purple))"
              : "rgba(0,0,0,0.14)",
            transition: "background 0.4s ease",
          }}
        >
          <div className="w-full h-full rounded-[22px] bg-[var(--bg-primary)]" />
        </div>

        {/* ── Input card ── */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.99)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Subtle top shimmer */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,45,107,0.3), transparent)",
              opacity: isActive ? 1 : 0,
              transition: "opacity 0.4s",
            }}
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            rows={3}
            disabled={loading}
            className="
              w-full px-6 pt-6 pb-16 text-[15px] leading-relaxed
              bg-transparent text-[var(--text-primary)]
              placeholder:text-[var(--text-tertiary)]
              resize-none outline-none
              disabled:opacity-50
              text-[var(--text-primary)]
            "
          />

          {/* ── Bottom bar ── */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3.5 flex items-center justify-between border-t border-[var(--border-subtle)]">
            {/* Hint */}
            <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-black/[0.05] rounded-md text-[10px] font-semibold border border-[var(--border-default)]">
                Enter
              </kbd>{" "}
              to generate
            </span>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!value.trim() || loading}
              id="prompt-submit-btn"
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold
                transition-all duration-300 cursor-pointer
                disabled:opacity-40 disabled:cursor-not-allowed
                ${
                  value.trim() && !loading
                    ? "btn-pink shadow-[0_4px_16px_rgba(255,45,107,0.3)]"
                    : "bg-white/[0.06] text-[var(--text-tertiary)]"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Build it free
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Character counter / hint ── */}
      {value.length > 0 && (
        <p className="text-center text-xs text-[var(--text-tertiary)] mt-2 opacity-60">
          {value.length} chars — add more detail for better results
        </p>
      )}
    </div>
  );
}
