import { GeneratedFile } from "@/types/ai";
import {
  ValidationError,
  ValidationResult,
} from "@/types/validator";

export function validateGeneratedFiles(
  files: GeneratedFile[]
): ValidationResult {
  const errors: ValidationError[] = [];

  const paths = new Set<string>();

  for (const file of files) {
    // duplicate files
    if (paths.has(file.path)) {
      errors.push({
        type: "duplicate_file",
        file: file.path,
        message: "Duplicate file detected.",
      });

      continue;
    }

    paths.add(file.path);

    // default export
    if (
      file.path === "src/App.tsx" &&
      !file.content.includes("export default")
    ) {
      errors.push({
        type: "missing_default_export",
        file: file.path,
        message: "App.tsx must export default.",
      });
    }

    // lucide imports
    const matches = file.content.matchAll(
      /import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"]/g
    );

    for (const match of matches) {
      const icons = match[1]
        .split(",")
        .map((i) => i.trim());

      for (const icon of icons) {
        errors.push({
          type: "invalid_import",
          file: file.path,
          message:
            "Verify this Lucide icon exists.",
          value: icon,
        });
      }
    }
  }

  return {
    success: errors.length === 0,
    errors,
  };
}