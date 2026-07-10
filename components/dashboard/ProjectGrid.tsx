"use client";

import ProjectCard from "./ProjectCard";
import EmptyState from "./EmptyState";
import { SkeletonGrid } from "./SkeletonCard";
import type { ProjectData } from "@/lib/api";

interface ProjectGridProps {
  projects: ProjectData[];
  loading: boolean;
  onOpen?: (project: ProjectData) => void;
  onDelete?: (project: ProjectData) => void;
  onDuplicate?: (project: ProjectData) => void;
  onCreateFirst?: () => void;
}

export default function ProjectGrid({
  projects,
  loading,
  onOpen,
  onDelete,
  onDuplicate,
  onCreateFirst,
}: ProjectGridProps) {
  if (loading) {
    return <SkeletonGrid count={6} />;
  }

  if (projects.length === 0) {
    return <EmptyState onAction={onCreateFirst} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          onOpen={onOpen}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
}
