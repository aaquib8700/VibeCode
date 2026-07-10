"use client";

import { useState, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(props.value) || Boolean(props.defaultValue);
  const isActive = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        className={`
          w-full px-4 pt-6 pb-2 text-sm font-medium
          bg-[var(--bg-input)] rounded-xl
          border transition-all duration-[var(--transition-default)]
          text-[var(--text-primary)] placeholder-transparent
          focus:outline-none peer
          ${
            error
              ? "border-red-500/50 focus:border-red-500"
              : "border-[var(--border-subtle)] focus:border-[var(--accent-indigo)] hover:border-[var(--border-hover)]"
          }
          ${focused ? "shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" : ""}
        `}
        placeholder={label}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />

      <label
        htmlFor={id}
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${
            isActive
              ? "top-2 text-[10px] font-semibold text-[var(--accent-glow)]"
              : "top-1/2 -translate-y-1/2 text-sm text-[var(--text-tertiary)]"
          }
        `}
      >
        {label}
      </label>

      {error && (
        <p className="mt-1.5 text-xs text-red-400 animate-fade-in pl-1">
          {error}
        </p>
      )}
    </div>
  );
}
