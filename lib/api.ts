export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ProjectData {
  id: string;
  title: string | null;
  prompt: string;
  status: string;
  sandboxId: string | null;
  previewUrl: string | null;
  files?: { path: string; content: string }[];
  createdAt: string;
  updatedAt: string;
}

export async function generateProject(
  prompt: string
): Promise<ApiResponse<ProjectData>> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  return res.json();
}

export async function getProjects(): Promise<ApiResponse<ProjectData[]>> {
  const res = await fetch("/api/projects", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return res.json();
}

export async function getProject(
  id: string
): Promise<ApiResponse<ProjectData>> {
  const res = await fetch(`/api/projects/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return res.json();
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
