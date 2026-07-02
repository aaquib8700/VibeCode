import { GeneratedFile } from "@/types/ai";

import { PACKAGE_JSON } from "@/templates/react/package-json";
import { VITE_CONFIG } from "@/templates/react/vite-config";
import { TSCONFIG } from "@/templates/react/tsconfig";
import { TSCONFIG_NODE } from "@/templates/react/tsconfig-node";
import { TAILWIND_CONFIG } from "@/templates/react/tailwind-config";
import { POSTCSS_CONFIG } from "@/templates/react/postcss-config";
import { INDEX_HTML } from "@/templates/react/index-html";
import { MAIN_TSX } from "@/templates/react/main-tsx";
import { INDEX_CSS } from "@/templates/react/index-css";

export async function getReactTemplateFiles(): Promise<GeneratedFile[]> {
  return [
    {
      path: "package.json",
      content: PACKAGE_JSON,
    },
    {
      path: "vite.config.ts",
      content: VITE_CONFIG,
    },
    {
      path: "tsconfig.json",
      content: TSCONFIG,
    },
    {
      path: "tsconfig.node.json",
      content: TSCONFIG_NODE,
    },
    {
      path: "tailwind.config.js",
      content: TAILWIND_CONFIG,
    },
    {
      path: "postcss.config.js",
      content: POSTCSS_CONFIG,
    },
    {
      path: "index.html",
      content: INDEX_HTML,
    },
    {
      path: "src/main.tsx",
      content: MAIN_TSX,
    },
    {
      path: "src/index.css",
      content: INDEX_CSS,
    },
  ];
}

export async function getNextTemplateFiles(): Promise<GeneratedFile[]> {
  // Next template implement karenge jab Next support complete karenge
  return [];
}