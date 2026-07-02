export interface GenerateProjectEvent {
  projectId: string;
  prompt: string;
}

export interface EditProjectEvent {
  projectId: string;
  prompt: string;
}

export type ProjectEventName =
  | "project/generate"
  | "project/edit";