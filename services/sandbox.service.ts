import { Sandbox } from "e2b";
import { createSandbox } from "@/lib/e2b";
import { GeneratedFile, SandboxResult } from "@/types/ai";

const SANDBOX_TIMEOUT = 15 * 60 * 1000;

async function connectSandbox(sandboxId: string) {
  return Sandbox.connect(sandboxId, {
    timeoutMs: SANDBOX_TIMEOUT,
  });
}

export async function createProjectSandbox(
  files: GeneratedFile[],
  framework: "react" | "nextjs",
): Promise<SandboxResult> {
  const sandbox = await createSandbox();

  const port = framework === "react" ? 5173 : 3000;

  const devCommand = framework === "react" ? "npm run dev" : "npm run dev";

  for (const file of files) {
    await sandbox.files.write(file.path, file.content);
  }
console.log("Installing dependencies...");

const install = await sandbox.commands.run(
  "npm install --legacy-peer-deps --force"
);

console.log("========== INSTALL STDOUT ==========");
console.log(install.stdout);

console.log("========== INSTALL STDERR ==========");
console.log(install.stderr);

console.log("========== INSTALL EXIT CODE ==========");
console.log(install.exitCode);

console.log("Starting development server...");

const dev=await sandbox.commands.run(
  "npm run dev -- --host 0.0.0.0 --strictPort",
  {
    background: true,
  }
);

console.log("========== DEV STDOUT ==========");
console.log(dev.stdout);

console.log("========== DEV STDERR ==========");
console.log(dev.stderr);

console.log("========== DEV EXIT CODE ==========");
console.log(dev.exitCode);

console.log("Waiting for dev server...");

await new Promise((resolve) => setTimeout(resolve, 10000));

const host = await sandbox.getHost(port);

console.log("Preview Host:", host);

  return {
    sandboxId: sandbox.sandboxId,
    previewUrl: `https://${host}`,
  };
}

export async function updateProjectSandbox(
  sandboxId: string,
  files: GeneratedFile[],
) {
  const sandbox = await connectSandbox(sandboxId);

  for (const file of files) {
    await sandbox.files.write(file.path, file.content);
  }
}

export async function runSandboxCommand(sandboxId: string, command: string) {
  const sandbox = await connectSandbox(sandboxId);

  return sandbox.commands.run(command);
}

export async function stopProjectSandbox(sandboxId: string) {
  const sandbox = await connectSandbox(sandboxId);

  await sandbox.kill();
}

export async function readSandboxFiles(
  sandboxId: string,
): Promise<GeneratedFile[]> {
  const sandbox = await connectSandbox(sandboxId);

  const entries = await sandbox.files.list("/");

  const files: GeneratedFile[] = [];

  for (const entry of entries) {
    if (entry.type !== "file") continue;

    files.push({
      path: entry.path,
      content: await sandbox.files.read(entry.path),
    });
  }

  return files;
}
