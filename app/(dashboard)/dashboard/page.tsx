"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import PromptInput from "@/components/landing/PromptInput";
import SuggestionChips from "@/components/landing/SuggestionChips";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastContext";
import { generateProject, getProjects, type ProjectData } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const promptRef = useRef<HTMLDivElement>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProjects();
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch {
      addToast("error", "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  async function handleGenerate(prompt: string) {
    setGenerating(true);
    try {
      const res = await generateProject(prompt);
      if (res.success && res.data) {
        addToast("success", "Project generation started!");
        router.push(`/builder/${res.data.id}`);
      } else {
        addToast("error", res.message || "Failed to generate project.");
      }
    } catch {
      addToast("error", "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function handleSuggestionSelect(prompt: string) {
    // Scroll to prompt area and fill
    promptRef.current?.scrollIntoView({ behavior: "smooth" });
    // We pass it directly through the generate flow
    handleGenerate(prompt);
  }

  function scrollToPrompt() {
    promptRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleOpenProject(project: ProjectData) {
    router.push(`/builder/${project.id}`);
  }

  function handleDuplicate(project: ProjectData) {
    handleGenerate(project.prompt);
    addToast("info", "Duplicating project with same prompt…");
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
            {user ? (
              <>
                Welcome back,{" "}
                <span className="gradient-text">{user.name.split(" ")[0]}</span>
              </>
            ) : (
              <>
                Your <span className="gradient-text">Dashboard</span>
              </>
            )}
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            Create something amazing with AI — describe what you want to build.
          </p>
        </div>

        {/* Prompt Section */}
        <div ref={promptRef} className="mb-8">
          <PromptInput
            onSubmit={handleGenerate}
            loading={generating}
            placeholder="What do you want to build next?"
          />
          <SuggestionChips onSelect={handleSuggestionSelect} />
        </div>

        {/* Projects Section */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <FolderOpen size={20} className="text-[var(--accent-glow)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Recent Projects
            </h3>
            {projects.length > 0 && (
              <span className="text-xs font-medium text-[var(--text-tertiary)] bg-white/5 px-2.5 py-1 rounded-full">
                {projects.length}
              </span>
            )}
          </div>

          <ProjectGrid
            projects={projects}
            loading={loading}
            onOpen={handleOpenProject}
            onDuplicate={handleDuplicate}
            onCreateFirst={scrollToPrompt}
          />
        </div>
      </main>
    </div>
  );
}
