export interface GeneratedFile {
  path: string;
  content: string;
}

export interface ParsedGeneratorResponse {
  dependencies: string[];
  files: GeneratedFile[];
}

export interface GenerateProjectInput {
  prompt: string;
}

export interface EditProjectInput {
  projectId: string;
  sandboxId: string;
  prompt: string;
}

export interface SandboxResult {
  sandboxId: string;
  previewUrl: string;
}

export interface PlannerResponse {
  title: string;
  description: string;
  steps: string[];
}