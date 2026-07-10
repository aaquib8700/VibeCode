"use client";

import { Sparkles, Rocket } from "lucide-react";

interface EmptyStateProps {
  onAction?: () => void;
}

export default function EmptyState({ onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in-up">
      {/* Illustration */}
      <div className="relative mb-8">
        {/* Outer ring */}
        <div className="w-32 h-32 rounded-full border-2 border-dashed border-[var(--border-default)] flex items-center justify-center animate-spin-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[rgba(255,45,107,0.2)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-[rgba(255,45,107,0.15)]" />
        </div>

        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(255,45,107,0.06)",
              border: "1px solid rgba(255,45,107,0.15)",
            }}
          >
            <Rocket
              size={32}
              className="text-[var(--accent-pink)] animate-float"
            />
          </div>
        </div>

        {/* Floating sparkles */}
        <Sparkles
          size={14}
          className="absolute -top-2 -right-2 text-[var(--accent-pink)] opacity-40 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <Sparkles
          size={10}
          className="absolute -bottom-1 -left-3 text-[var(--accent-pink)] opacity-30 animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Text */}
      <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">
        No projects yet
      </h3>
      <p className="text-sm text-[var(--text-secondary)] text-center max-w-sm mb-6 leading-relaxed">
        Create your first AI-powered project by describing what you want to
        build in the prompt above. It only takes seconds.
      </p>

      {/* CTA */}
      {onAction && (
        <button
          onClick={onAction}
          className="
            flex items-center gap-2 px-6 py-3 rounded-full
            text-sm font-bold text-white btn-pink
            shadow-[var(--shadow-pink)]
            active:scale-[0.97]
            transition-all duration-300 cursor-pointer
          "
        >
          <Sparkles size={16} />
          Create your first project
        </button>
      )}
    </div>
  );
}
