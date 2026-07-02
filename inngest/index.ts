import { inngest } from "./client";
import { generateProject } from "./functions/generate";
import { editProject } from "./functions/edit";

export const functions = [
  generateProject,
  editProject,
];

export { inngest } from "./client";