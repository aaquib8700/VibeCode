import { IDENTITY_PROMPT } from "./identity";
import { ENVIRONMENT_PROMPT } from "./environment";
import { CODING_PROMPT } from "./coding";
import { RUNTIME_PROMPT } from "./runtime";
import { OUTPUT_PROMPT } from "./output";

export const SYSTEM_PROMPT = [
  IDENTITY_PROMPT,
  ENVIRONMENT_PROMPT,
  CODING_PROMPT,
  RUNTIME_PROMPT,
  OUTPUT_PROMPT,
].join("\n\n");