"use client";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "pending";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-default)]",
  success: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  error: "bg-red-500/10 text-red-700 border-red-500/20",
  info: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  pending: "bg-[rgba(255,45,107,0.08)] text-[var(--accent-pink)] border-[rgba(255,45,107,0.2)]",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-slate-400",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  pending: "bg-[var(--accent-pink)]",
};

export default function Badge({
  variant = "default",
  children,
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold
        rounded-full border uppercase tracking-wider
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} ${
            variant === "pending" ? "animate-pulse" : ""
          }`}
        />
      )}
      {children}
    </span>
  );
}

export function getStatusVariant(
  status: string
): BadgeVariant {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "RUNNING":
      return "info";
    case "FAILED":
      return "error";
    case "PENDING":
    case "PLANNING":
    case "GENERATING":
    case "CREATING_SANDBOX":
    case "INSTALLING_DEPENDENCIES":
      return "pending";
    default:
      return "default";
  }
}
