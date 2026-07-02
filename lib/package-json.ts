export function mergePackageJson(
  packageJsonContent: string,
  dependencies: string[]
): string {
  const packageJson = JSON.parse(packageJsonContent);

  packageJson.dependencies ??= {};

  for (const dependency of dependencies) {
    if (!dependency?.trim()) continue;

    if (!packageJson.dependencies[dependency]) {
      packageJson.dependencies[dependency] = "latest";
    }
  }

  return JSON.stringify(packageJson, null, 2);
}