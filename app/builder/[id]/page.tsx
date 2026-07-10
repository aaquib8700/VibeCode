"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Code2,
  Folder,
  FileCode,
  Play,
  RotateCw,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Loader2,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Circle,
  Code,
  X,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastContext";
import { getProject, type ProjectData } from "@/lib/api";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-json";

/* ── Types ─────────────────────────────────────────────────────── */
interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
}

/* ── File tree builder ──────────────────────────────────────────── */
function buildFileTree(files: { path: string; content: string }[]): FileNode[] {
  const root: FileNode[] = [];
  for (const file of files) {
    const normalizedPath = file.path.replace(/^\.\//, "");
    const parts = normalizedPath.split("/");
    let currentLevel = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join("/");
      let existing = currentLevel.find((n) => n.name === part);
      if (!existing) {
        existing = {
          name: part,
          path: currentPath,
          type: isFile ? "file" : "folder",
          children: isFile ? undefined : [],
          content: isFile ? file.content : undefined,
        };
        currentLevel.push(existing);
      }
      if (!isFile && existing.children) currentLevel = existing.children;
    }
  }
  const sortTree = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => n.children && sortTree(n.children));
  };
  sortTree(root);
  return root;
}

/* ── Animated VibeCode logo (tiny, for top bar) ─────────────────── */
function VibeLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="9" fill="url(#bld-logo-grad)" />
      <defs>
        <linearGradient id="bld-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff2d6b" />
          <stop offset="100%" stopColor="#e91e8c" />
        </linearGradient>
      </defs>
      <path d="M11 12 L8 18 L11 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M25 12 L28 18 L25 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M21 12 L15 24" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Build step status icons ────────────────────────────────────── */
function StepIcon({ status }: { status: string }) {
  if (status === "done")
    return <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />;
  if (status === "loading")
    return <Loader2 size={16} className="text-[var(--accent-pink)] animate-spin shrink-0" />;
  if (status === "failed")
    return <X size={16} className="text-red-500 shrink-0" />;
  return (
    <div className="w-4 h-4 rounded-full border-2 border-gray-200 shrink-0" />
  );
}

/* ── Main builder page ──────────────────────────────────────────── */
export default function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string } | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ src: true });
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [copied, setCopied] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [editing, setEditing] = useState(false);

  /* ── Polling ── */
  const fetchProjectDetails = useCallback(async () => {
    try {
      const res = await getProject(id);
      if (res.success && res.data) {
        const proj = res.data;
        setProject(proj);
        if (proj.files && proj.files.length > 0 && !selectedFile) {
          const appFile = proj.files.find(
            (f) => f.path.endsWith("App.tsx") || f.path.endsWith("page.tsx")
          );
          setSelectedFile(appFile || proj.files[0]);
        } else if (proj.files && selectedFile) {
          const updated = proj.files.find((f) => f.path === selectedFile.path);
          if (updated && updated.content !== selectedFile.content) setSelectedFile(updated);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, selectedFile]);

  useEffect(() => {
    fetchProjectDetails();
    const interval = setInterval(() => {
      if (project?.status !== "COMPLETED" && project?.status !== "FAILED") {
        fetchProjectDetails();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchProjectDetails, project?.status]);

  /* ── Handlers ── */
  const handleCopyCode = async () => {
    if (!selectedFile) return;
    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast("success", "Code copied to clipboard!");
    } catch {
      addToast("error", "Failed to copy code.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || !project || editing) return;
    setEditing(true);
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, sandboxId: project.sandboxId, prompt: promptInput }),
      });
      const data = await res.json();
      if (data.success) {
        addToast("success", "Edit request submitted! Generating updates...");
        setPromptInput("");
        fetchProjectDetails();
      } else {
        addToast("error", data.error || "Failed to submit edit request.");
      }
    } catch {
      addToast("error", "Failed to submit edit. Please try again.");
    } finally {
      setEditing(false);
    }
  };

  /* ── Build steps ── */
  const getBuildSteps = () => {
    const steps = [
      { id: "files", label: "Project Files", status: "pending" },
      { id: "structure", label: "Plan Project Structure", status: "pending" },
      { id: "code", label: "Generating Codebase", status: "pending" },
      { id: "sandbox", label: "Creating Sandbox", status: "pending" },
      { id: "install", label: "Installing Dependencies", status: "pending" },
      { id: "ready", label: "Running Dev Server", status: "pending" },
    ];
    if (!project) return steps;
    const s = project.status;
    if (s === "PENDING") { steps[0].status = "loading"; }
    else if (s === "PLANNING") { steps[0].status = "done"; steps[1].status = "loading"; }
    else if (s === "GENERATING") { steps[0].status = "done"; steps[1].status = "done"; steps[2].status = "loading"; }
    else if (s === "CREATING_SANDBOX") { steps[0].status = "done"; steps[1].status = "done"; steps[2].status = "done"; steps[3].status = "loading"; }
    else if (s === "INSTALLING_DEPENDENCIES") { steps.slice(0, 4).forEach(x => x.status = "done"); steps[4].status = "loading"; }
    else if (s === "RUNNING") { steps.slice(0, 5).forEach(x => x.status = "done"); steps[5].status = "loading"; }
    else if (s === "COMPLETED") { steps.forEach(x => x.status = "done"); }
    else if (s === "FAILED") { steps.forEach(x => { if (x.status !== "done") x.status = "failed"; }); }
    return steps;
  };

  /* ── File tree rendering ── */
  const fileTree = project?.files ? buildFileTree(project.files) : [];
  const toggleFolder = (path: string) => setExpandedFolders((p) => ({ ...p, [path]: !p[path] }));

  const renderFileNode = (node: FileNode, depth = 0) => {
    const isExpanded = expandedFolders[node.path];
    const isSelected = selectedFile?.path === node.path;
    if (node.type === "folder") {
      return (
        <div key={node.path} className="select-none">
          <button
            onClick={() => toggleFolder(node.path)}
            className="w-full flex items-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] transition-colors cursor-pointer text-left"
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            <Folder size={13} className="text-amber-500 shrink-0" />
            <span className="truncate">{node.name}</span>
          </button>
          {isExpanded && node.children && (
            <div className="mt-0.5">
              {node.children.map((child) => renderFileNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }
    return (
      <button
        key={node.path}
        onClick={() => setSelectedFile({ path: node.path, content: node.content || "" })}
        className={`w-full flex items-center gap-1.5 py-1.5 px-2 rounded-lg text-xs text-left transition-all cursor-pointer ${
          isSelected
            ? "bg-[rgba(255,45,107,0.08)] border border-[rgba(255,45,107,0.2)] text-[var(--accent-pink)] font-semibold"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] border border-transparent"
        }`}
        style={{ paddingLeft: `${depth * 12 + 20}px` }}
      >
        <FileCode size={13} className={isSelected ? "text-[var(--accent-pink)]" : "text-blue-400"} />
        <span className="truncate">{node.name}</span>
      </button>
    );
  };

  const isGenerating =
    project &&
    project.status !== "COMPLETED" &&
    project.status !== "RUNNING" &&
    project.status !== "FAILED";

  /* ── Language helper ── */
  const getLanguage = (path: string) => {
    const ext = path.split(".").pop() || "";
    if (ext === "js" || ext === "jsx") return "javascript";
    if (ext === "ts") return "typescript";
    if (ext === "tsx") return "tsx";
    if (ext === "css") return "css";
    if (ext === "html") return "markup";
    if (ext === "json") return "json";
    return "javascript";
  };

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-secondary)] text-[var(--text-primary)]">

      {/* ── TOP HEADER BAR ── */}
      <header
        className="h-14 flex items-center justify-between px-5 shrink-0 bg-white border-b border-[var(--border-default)]"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
      >
        {/* Left: Logo + project info */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="cursor-pointer" aria-label="Go home">
            <VibeLogo />
          </button>
          <div className="w-[1px] h-6 bg-[var(--border-default)]" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--text-primary)]">Builder</span>
              <span className="text-[10px] font-semibold text-[var(--text-tertiary)] bg-black/[0.05] border border-[var(--border-default)] px-1.5 py-0.5 rounded-md font-mono">
                {id.slice(0, 8)}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)] max-w-xs truncate leading-none mt-0.5">
              {project?.prompt || "Creating your application..."}
            </p>
          </div>
        </div>

        {/* Right: Open Sandbox button */}
        <div className="flex items-center gap-3">
          {project?.previewUrl && (
            <a
              href={project.previewUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 btn-pink rounded-full text-xs font-bold"
            >
              <ExternalLink size={12} />
              Open Sandbox
            </a>
          )}
        </div>
      </header>

      {/* ── WORKSPACE BODY ── */}
      <main className="flex-1 flex overflow-hidden">

        {/* ── LOADING SPINNER ── */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <Loader2 size={36} className="text-[var(--accent-pink)] animate-spin" />
            <p className="text-sm text-[var(--text-secondary)]">Loading workspace…</p>
          </div>

        ) : isGenerating ? (
          /* ── BUILD PROGRESS SCREEN ── */
          <div className="flex-1 flex justify-center items-center py-12 px-6 bg-[var(--bg-secondary)]">
            <div
              className="w-full max-w-md bg-white rounded-3xl p-8 relative overflow-hidden"
              style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-extrabold text-[var(--text-primary)] mb-0.5">
                    Building Project
                  </h2>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Watching builder steps in real-time…
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(255,45,107,0.08)", border: "1px solid rgba(255,45,107,0.15)" }}>
                  <Loader2 size={18} className="text-[var(--accent-pink)] animate-spin" />
                </div>
              </div>

              {/* Steps list */}
              <div className="space-y-4">
                {getBuildSteps().map((step) => (
                  <div key={step.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StepIcon status={step.status} />
                      <span
                        className={`text-sm font-medium ${
                          step.status === "done"
                            ? "text-[var(--text-primary)]"
                            : step.status === "loading"
                            ? "text-[var(--accent-pink)] font-semibold"
                            : "text-[var(--text-tertiary)]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {step.status === "loading" && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full animate-pulse"
                        style={{ background: "rgba(255,45,107,0.1)", color: "var(--accent-pink)" }}
                      >
                        active
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Animated pink progress bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl overflow-hidden">
                <div
                  className="h-full animate-gradient-flow"
                  style={{
                    background: "linear-gradient(90deg, var(--accent-pink), var(--accent-magenta), var(--accent-purple), var(--accent-pink))",
                    backgroundSize: "200% 100%",
                  }}
                />
              </div>
            </div>
          </div>

        ) : project?.status === "FAILED" ? (
          /* ── FAILED SCREEN ── */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto gap-4 animate-scale-in">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <X size={28} className="text-red-500" />
            </div>
            <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Generation Failed</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              We encountered an issue during generation. Try going back and rephrasing your prompt with more detail.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-2 btn-pink px-6 py-2.5 rounded-full text-sm font-bold"
            >
              Back to Dashboard
            </button>
          </div>

        ) : (
          /* ── THREE-COLUMN WORKSPACE ── */
          <div className="flex-1 flex overflow-hidden">

            {/* ── LEFT: Build Steps + Prompt ── */}
            <div className="w-72 shrink-0 border-r border-[var(--border-default)] flex flex-col bg-white">

              {/* Build Steps */}
              <div className="px-4 pt-4 pb-3 border-b border-[var(--border-default)]">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">
                  Build Steps
                </h3>
                <div className="space-y-2">
                  {getBuildSteps().map((step) => (
                    <div key={step.id} className="flex items-center gap-2.5">
                      <StepIcon status={step.status} />
                      <span
                        className={`text-xs font-medium truncate ${
                          step.status === "done"
                            ? "text-[var(--text-primary)]"
                            : step.status === "loading"
                            ? "text-[var(--accent-pink)]"
                            : "text-[var(--text-tertiary)]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prompt to Modify */}
              <div className="flex-1 flex flex-col justify-end p-4 gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                  <MessageSquare size={13} className="text-[var(--accent-pink)]" />
                  Prompt to Modify App
                </div>
                <form onSubmit={handleEditSubmit} className="relative">
                  <textarea
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="E.g., Change the theme to dark mode or add a contact form…"
                    rows={4}
                    disabled={editing}
                    className="
                      w-full bg-[var(--bg-secondary)] border border-[var(--border-default)]
                      focus:border-[var(--accent-pink)] focus:ring-2 focus:ring-[rgba(255,45,107,0.1)]
                      rounded-2xl py-3 pl-3.5 pr-11 text-sm
                      placeholder:text-[var(--text-tertiary)]
                      text-[var(--text-primary)]
                      focus:outline-none resize-none transition-all
                    "
                  />
                  <button
                    type="submit"
                    disabled={!promptInput.trim() || editing}
                    className="absolute right-3 bottom-3.5 p-1.5 rounded-xl btn-pink disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    {editing ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <ArrowRight size={13} />
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* ── MIDDLE: File Explorer ── */}
            <div className="w-56 shrink-0 border-r border-[var(--border-default)] flex flex-col bg-white">
              <div
                className="h-10 border-b border-[var(--border-default)] flex items-center px-4 bg-[var(--bg-secondary)]"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                  File Explorer
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {fileTree.map((node) => renderFileNode(node))}
              </div>
            </div>

            {/* ── RIGHT: Code / Preview ── */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
              {/* Tab bar */}
              <div
                className="h-10 border-b border-[var(--border-default)] flex items-center justify-between px-4 bg-[var(--bg-secondary)] shrink-0"
              >
                {/* Tabs */}
                <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] p-0.5 rounded-lg border border-[var(--border-default)]">
                  <button
                    onClick={() => setActiveTab("code")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "code"
                        ? "bg-white text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Code size={12} />
                    Code
                  </button>
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "preview"
                        ? "bg-white text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Play size={12} />
                    Preview
                  </button>
                </div>

                {/* File path + copy */}
                {activeTab === "code" && selectedFile && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-tertiary)] font-mono truncate max-w-[260px]">
                      {selectedFile.path}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--accent-pink)] hover:border-[var(--border-pink)] transition-all cursor-pointer text-xs"
                      title="Copy code"
                    >
                      {copied ? (
                        <Check size={12} className="text-emerald-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Code / Preview content */}
              <div className="flex-1 relative overflow-hidden">
                {activeTab === "code" ? (
                  selectedFile ? (() => {
                    const lang = getLanguage(selectedFile.path);
                    const grammar = Prism.languages[lang] || Prism.languages.javascript;
                    const highlightedHtml = Prism.highlight(selectedFile.content, grammar, lang);
                    return (
                      <div className="absolute inset-0 overflow-auto bg-[#1e1e2e] font-mono text-sm p-6 leading-relaxed flex flex-row">
                        {/* Line numbers */}
                        <div className="select-none text-right pr-4 text-white/20 border-r border-white/5 text-xs mr-4 leading-normal flex flex-col shrink-0">
                          {selectedFile.content.split("\n").map((_, i) => (
                            <span key={i}>{i + 1}</span>
                          ))}
                        </div>
                        {/* Code */}
                        <pre className="text-xs whitespace-pre leading-normal overflow-visible pr-6 flex-1">
                          <code
                            className={`language-${lang} !text-[#e2e8f0]`}
                            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                          />
                        </pre>
                      </div>
                    );
                  })() : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] flex items-center justify-center">
                        <FileCode size={22} className="text-[var(--text-tertiary)]" />
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Select a file to view its code
                      </p>
                    </div>
                  )
                ) : (
                  project?.previewUrl ? (
                    <div className="absolute inset-0 flex flex-col">
                      {/* Browser chrome */}
                      <div className="h-10 bg-[var(--bg-secondary)] border-b border-[var(--border-default)] flex items-center px-3 gap-2 shrink-0">
                        <button
                          onClick={() => {
                            const frame = document.getElementById("preview-iframe") as HTMLIFrameElement;
                            if (frame) frame.src = frame.src;
                          }}
                          className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                        >
                          <RotateCw size={12} />
                        </button>
                        <div className="flex-1 bg-white border border-[var(--border-default)] rounded-lg px-3 py-1 text-[11px] text-[var(--text-tertiary)] font-mono truncate">
                          {project.previewUrl}
                        </div>
                      </div>
                      {/* iframe */}
                      <iframe
                        id="preview-iframe"
                        src={project.previewUrl}
                        className="flex-1 w-full bg-white border-0"
                        title="Sandbox Preview"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] flex items-center justify-center">
                        <Play size={22} className="text-[var(--accent-pink)] animate-pulse" />
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Preview server starting… wait a moment.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
