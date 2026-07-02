import { GeneratedFile } from "./ai";

export type ProjectStatus =
  | "PENDING"
  | "PLANNING"
  | "GENERATING"
  | "CREATING_SANDBOX"
  | "INSTALLING_DEPENDENCIES"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface ProjectResult {
  projectId: string;
  sandboxId: string;
  previewUrl: string;
  files: GeneratedFile[];
}

export interface ProjectMetadata {
  id: string;
  prompt: string;
  status: ProjectStatus;
  sandboxId: string | null;
  previewUrl: string | null;
}