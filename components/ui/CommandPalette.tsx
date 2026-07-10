"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Search, ArrowRight, Command, Sparkles, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: CommandItem[] = [
    {
      id: "new-project",
      label: "New Project",
      description: "Create a new AI-generated project",
      icon: <Sparkles size={16} />,
      action: () => {
        onClose();
        router.push("/dashboard");
      },
      category: "Actions",
    },
    {
      id: "dashboard",
      label: "Go to Dashboard",
      description: "View your projects",
      icon: <FolderOpen size={16} />,
      action: () => {
        onClose();
        router.push("/dashboard");
      },
      category: "Navigation",
    },
    {
      id: "home",
      label: "Go to Home",
      description: "Back to landing page",
      icon: <ArrowRight size={16} />,
      action: () => {
        onClose();
        router.push("/");
      },
      category: "Navigation",
    },
  ];

  const filtered = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description?.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback(
    (cmd: CommandItem) => {
      cmd.action();
      setQuery("");
      setSelectedIndex(0);
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex]);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, handleSelect]);

  if (!isOpen) return null;

  // Group by category
  const categories = Array.from(new Set(filtered.map((c) => c.category)));

  return (
    <>
      {/* Backdrop */}
      <div className="overlay" onClick={onClose} />

      {/* Palette */}
      <div
        className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[60] w-full max-w-[560px] animate-scale-in"
      >
        <div className="glass-strong rounded-2xl shadow-[var(--shadow-lg)] overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border-subtle)]">
            <Search size={18} className="text-[var(--text-tertiary)] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command or search…"
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
            />
            <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-[var(--text-tertiary)] bg-white/5 rounded-md border border-[var(--border-subtle)]">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[300px] overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[var(--text-tertiary)]">
                No results found.
              </div>
            ) : (
              categories.map((cat) => (
                <div key={cat}>
                  <div className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                    {cat}
                  </div>
                  {filtered
                    .filter((c) => c.category === cat)
                    .map((cmd) => {
                      const globalIndex = filtered.indexOf(cmd);
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => handleSelect(cmd)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer
                            transition-colors duration-100
                            ${
                              globalIndex === selectedIndex
                                ? "bg-[var(--accent-indigo)]/10 text-[var(--text-primary)]"
                                : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
                            }
                          `}
                        >
                          <span className="flex-shrink-0 text-[var(--accent-glow)]">
                            {cmd.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{cmd.label}</div>
                            {cmd.description && (
                              <div className="text-xs text-[var(--text-tertiary)] truncate">
                                {cmd.description}
                              </div>
                            )}
                          </div>
                          {globalIndex === selectedIndex && (
                            <ArrowRight size={14} className="text-[var(--text-tertiary)] flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white/5 rounded text-[10px] border border-[var(--border-subtle)]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white/5 rounded text-[10px] border border-[var(--border-subtle)]">↵</kbd>
              Select
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== Global Keyboard Shortcut Hook ===== */

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
