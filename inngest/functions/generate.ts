import { ProjectStatus } from "@/lib/generated/prisma/enums";
import { plannerAgent } from "@/agents/planner.agent";
import { generatorAgent } from "@/agents/generator.agent";
import { parseGeneratedFiles } from "@/lib/parser";
import { createProjectSandbox } from "@/services/sandbox.service";
import {
  updateProjectPreview,
  updateProjectStatus,
} from "@/services/project.service";
import { inngest } from "../client";
import {
  getReactTemplateFiles,
  getNextTemplateFiles,
} from "@/lib/template";
import { mergePackageJson } from "@/lib/package-json";
import { validateGeneratedFiles } from "@/lib/validator";



export const generateProject = inngest.createFunction(
  {
    id: "generate-project",
    triggers: [
      {
        event: "project/generate",
      },
    ],
    retries: 2,
  },
  async ({ event, step }) => {
    const { projectId, prompt } = event.data;

    try {
      await step.run("planning", async () => {
        await updateProjectStatus(projectId, ProjectStatus.PLANNING);
      });

      const plan = await step.run("planner-agent", async () => {
        return plannerAgent(prompt);
      });

      console.log("PLAN:", plan);

      await step.run("generating", async () => {
        await updateProjectStatus(projectId, ProjectStatus.GENERATING);
      });

      const generatedCode = await step.run(
        "generator-agent",
        async () => {
          return generatorAgent(plan);
        }
      );

      const files = await step.run("parse-files", async () => {
        console.log("========== AI RESPONSE ==========");
        console.log(generatedCode);
        console.log("================================");

        const parsed = parseGeneratedFiles(generatedCode);

        const dependencies = parsed.dependencies;
        const aiFiles = parsed.files;

        const validation = validateGeneratedFiles(
  aiFiles,
  dependencies
);

if (!validation.valid) {
  console.error("========== VALIDATION ERRORS ==========");
  console.error(validation.errors);
  console.error("=======================================");
  throw new Error(
    validation.errors.join("\n")
  );
}

        const fixedAiFiles = aiFiles.map((file) => {
  if (file.path !== "src/App.tsx") {
    return file;
  }

  let content = file.content;

  // export function App -> export default function App
  content = content.replace(
    /export\s+function\s+App/g,
    "export default function App"
  );

  // export const App = ...
  if (content.includes("export const App")) {
    content = content.replace(
      "export const App",
      "const App"
    );

    if (!content.includes("export default App")) {
      content += "\n\nexport default App;";
    }
  }

  return {
    ...file,
    content,
  };
});

        const templateFiles =
          plan.framework === "react"
            ? await getReactTemplateFiles()
            : await getNextTemplateFiles();

        const protectedFiles = new Set([
          "package.json",
          "vite.config.ts",
          "tsconfig.json",
          "tsconfig.node.json",
          "tailwind.config.js",
          "postcss.config.js",
          "index.html",
          "src/main.tsx",
          "src/index.css",
        ]);

        const normalizePath = (path: string) =>
          path.replace(/\\/g, "/").replace(/^\.\//, "");

        const filteredAiFiles = fixedAiFiles.filter(
          (file) => !protectedFiles.has(normalizePath(file.path))
        );

        const finalTemplateFiles = templateFiles.map((file) => {
          if (file.path === "package.json") {
            return {
              ...file,
              content: mergePackageJson(
                file.content,
                dependencies
              ),
            };
          }

          return file;
        });

        return [
          ...finalTemplateFiles,
          ...filteredAiFiles,
        ];
      });

      await step.run("creating-sandbox", async () => {
        await updateProjectStatus(
          projectId,
          ProjectStatus.CREATING_SANDBOX
        );
      });

      const sandbox = await step.run(
        "create-sandbox",
        async () => {
          return createProjectSandbox(
            files,
            plan.framework
          );
        }
      );

      await step.run("save-preview", async () => {
        await updateProjectPreview(
          projectId,
          sandbox.previewUrl,
          sandbox.sandboxId
        );
      });

      await step.run("running", async () => {
        await updateProjectStatus(
          projectId,
          ProjectStatus.RUNNING
        );
      });

      await step.run("completed", async () => {
        await updateProjectStatus(
          projectId,
          ProjectStatus.COMPLETED
        );
      });

      return {
        success: true,
        projectId,
        previewUrl: sandbox.previewUrl,
        sandboxId: sandbox.sandboxId,
      };
    } catch (error) {
      console.error(error);

      await updateProjectStatus(
        projectId,
        ProjectStatus.FAILED
      );

      throw error;
    }
  }
);