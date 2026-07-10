"use client";

import { ExternalLink, Copy, Trash2, Calendar } from "lucide-react";
import Badge, { getStatusVariant } from "@/components/ui/Badge";
import { formatRelativeTime, truncateText, type ProjectData } from "@/lib/api";

interface ProjectCardProps {
  project: ProjectData;
  onOpen?: (project: ProjectData) => void;
  onDelete?: (project: ProjectData) => void;
  onDuplicate?: (project: ProjectData) => void;
  index?: number;
}

export default function ProjectCard({
  project,
  onOpen,
  onDelete,
  onDuplicate,
  index = 0,
}: ProjectCardProps) {
  const title = project.title || "Untitled Project";
  const statusVariant = getStatusVariant(project.status);
  const isReady = project.status === "COMPLETED" || project.status === "RUNNING";

  return (
    <div
      className="
        group relative rounded-2xl p-5
        bg-[var(--bg-card)] border border-[var(--border-subtle)]
        transition-all duration-300 cursor-pointer
        hover:bg-[var(--bg-card-hover)]
        hover:border-[rgba(255,45,107,0.25)]
        hover:-translate-y-1
        shadow-[var(--shadow-card)]
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]
      "
      style={{
        animationDelay: `${index * 0.06}s`,
      }}
      onClick={() => onOpen?.(project)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug line-clamp-1 group-hover:text-[var(--accent-pink)] transition-colors">
          {title}
        </h3>
        <Badge variant={statusVariant} dot>
          {project.status.replace(/_/g, " ")}
        </Badge>
      </div>

      {/* Prompt Preview */}
      <div className="relative mb-4">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
          {truncateText(project.prompt, 120)}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
          <Calendar size={12} />
          {formatRelativeTime(project.createdAt)}
        </span>

        {isReady && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (project.previewUrl) {
                window.open(project.previewUrl, "_blank");
              }
            }}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              text-xs font-semibold
              bg-[rgba(255,45,107,0.08)]
              text-[var(--accent-pink)]
              border border-[rgba(255,45,107,0.2)]
              hover:border-[var(--accent-pink)]
              hover:shadow-[0_0_12px_rgba(255,45,107,0.15)]
              transition-all duration-200
              cursor-pointer
            "
          >
            <ExternalLink size={12} />
            Open Project
          </button>
        )}
      </div>

      {/* Hover Actions Overlay */}
      <div
        className="
          absolute top-3 right-3 flex items-center gap-1
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none group-hover:pointer-events-auto
        "
      >
        {onDuplicate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(project);
            }}
            className="p-1.5 rounded-lg bg-black/[0.04] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-black/[0.08] transition-all cursor-pointer border border-[var(--border-default)]"
            title="Duplicate"
          >
            <Copy size={13} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            className="p-1.5 rounded-lg bg-black/[0.04] text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer border border-[var(--border-default)]"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
