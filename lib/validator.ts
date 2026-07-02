import { GeneratedFile } from "@/types/ai";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const LOCAL_IMPORT_REGEX =
  /import\s+(?:[\w*\s{},]+)\s+from\s+["'](.+)["']/g;

export function validateGeneratedFiles(
  files: GeneratedFile[],
  dependencies: string[]
): ValidationResult {
  const errors: string[] = [];

  // -----------------------------
  // Duplicate Files
  // -----------------------------

  const paths = files.map((file) => normalize(file.path));

  const duplicates = paths.filter(
    (path, index) => paths.indexOf(path) !== index
  );

  if (duplicates.length) {
    errors.push(
      `Duplicate files: ${duplicates.join(", ")}`
    );
  }

  // -----------------------------
  // App.tsx default export
  // -----------------------------

  const app = files.find(
    (file) => normalize(file.path) === "src/App.tsx"
  );

  if (app) {
    if (!app.content.includes("export default")) {
      errors.push(
        "src/App.tsx must export a default component."
      );
    }
  }

  // -----------------------------
  // Local imports
  // -----------------------------

  const generatedFiles = new Set(paths);

  for (const file of files) {
    const imports = getImports(file.content);

    for (const imported of imports) {
      // Ignore npm packages
      if (!imported.startsWith(".")) continue;

      const resolved = resolveImport(
        normalize(file.path),
        imported
      );

      if (!generatedFiles.has(resolved)) {
        errors.push(
          `Missing file: ${resolved} (imported by ${file.path})`
        );
      }
    }
  }

  // -----------------------------
  // NPM Dependencies
  // -----------------------------

  const deps = new Set(dependencies);

  for (const file of files) {
    const imports = getImports(file.content);

    for (const imported of imports) {
      if (
        imported.startsWith(".") ||
        imported.startsWith("/")
      ) {
        continue;
      }

      if (
        imported === "react" ||
        imported === "react-dom"
      ) {
        continue;
      }

      if (!deps.has(imported)) {
        errors.push(
          `Missing dependency: ${imported}`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function getImports(code: string): string[] {
  const imports: string[] = [];

  const matches = code.matchAll(LOCAL_IMPORT_REGEX);

  for (const match of matches) {
    imports.push(match[1]);
  }

  return imports;
}

function normalize(path: string) {
  return path.replace(/\\/g, "/");
}

function resolveImport(
  currentFile: string,
  imported: string
) {
  const current = currentFile.split("/");

  current.pop();

  const parts = imported.split("/");

  for (const part of parts) {
    if (part === ".") continue;

    if (part === "..") {
      current.pop();
    } else {
      current.push(part);
    }
  }

  let finalPath = current.join("/");

  if (!finalPath.endsWith(".tsx")) {
    finalPath += ".tsx";
  }

  return finalPath;
}