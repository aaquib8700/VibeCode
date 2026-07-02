import {
  GeneratedFile,
  ParsedGeneratorResponse,
} from "@/types/ai";

export function parseGeneratedFiles(
  response: string
): ParsedGeneratorResponse {
  try {
    const parsed = JSON.parse(response);

    const dependencies = Array.isArray(parsed.dependencies)
      ? parsed.dependencies
      : [];

    const files: GeneratedFile[] = Object.entries(
      parsed.files ?? {}
    ).map(([path, content]) => ({
      path,
      content: String(content),
    }));

    return {
      dependencies,
      files,
    };
  } catch (error) {
    console.error("Parser Error:", error);

    throw new Error("Invalid AI response.");
  }
}