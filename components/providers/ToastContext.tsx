"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, duration = 4000) => {
      const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
      const toast: Toast = { id, type, message, duration };
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return (
    <ToastContext value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/* ===== Toast Container & Items ===== */

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: "var(--accent-success)",
  error: "var(--accent-error)",
  warning: "var(--accent-warning)",
  info: "var(--accent-blue)",
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const Icon = iconMap[toast.type];
  const color = colorMap[toast.type];

  return (
    <div
      role="alert"
      style={{
        animation: "toast-enter 0.35s ease-out",
        borderLeft: `3px solid ${color}`,
      }}
      className="glass-strong flex items-center gap-3 px-4 py-3 rounded-xl min-w-[300px] max-w-[420px] cursor-pointer"
      onClick={() => onRemove(toast.id)}
    >
      <Icon size={18} style={{ color, flexShrink: 0 }} />
      <p className="text-sm font-medium flex-1" style={{ color: "var(--text-primary)" }}>
        {toast.message}
      </p>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] rounded-b-xl"
        style={{
          background: color,
          animation: `toast-progress ${toast.duration}ms linear forwards`,
        }}
      />
    </div>
  );
}
