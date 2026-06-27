export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GenerateProjectResponse {
  files: GeneratedFile[];
}

export interface GenerateProjectInput {
  prompt: string;
}

export interface EditProjectInput {
  prompt: string;
  files: GeneratedFile[];
}

export interface SandboxResult {
  sandboxId: string;
  previewUrl: string;
}