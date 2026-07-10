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
import { NEXT_PACKAGE_JSON } from "@/templates/next/package-json";
import { NEXT_CONFIG } from "@/templates/next/next-config";
import { NEXT_TSCONFIG } from "@/templates/next/tsconfig-node-json";
import { NEXT_POSTCSS_CONFIG } from "@/templates/next/postcss-config";
import { NEXT_ESLINT_CONFIG } from "@/templates/next/eslint-config";
import { LAYOUT_TSX } from "@/templates/next/app/layout";
import { GLOBALS_CSS } from "@/templates/next/app/globals-css";

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
  return [
    {
      path: "package.json",
      content: NEXT_PACKAGE_JSON,
    },
    {
      path: "next.config.ts",
      content: NEXT_CONFIG,
    },
    {
      path: "tsconfig.json",
      content: NEXT_TSCONFIG,
    },
    {
      path: "postcss.config.mjs",
      content: NEXT_POSTCSS_CONFIG,
    },
    {
      path: "eslint.config.mjs",
      content: NEXT_ESLINT_CONFIG,
    },
    {
      path: "app/layout.tsx",
      content: LAYOUT_TSX,
    },
    {
      path: "app/globals.css",
      content: GLOBALS_CSS,
    },
  ];
}