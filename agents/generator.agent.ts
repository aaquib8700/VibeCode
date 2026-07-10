import { generateCode } from "@/services/openai.service";
import { PlannerOutput } from "./planner.agent";

export async function generatorAgent(
  plan: PlannerOutput
): Promise<string> {
  const prompt =
    plan.framework === "react"
      ? `
You are a senior frontend engineer.

You are generating a COMPLETE production-ready React application.

Environment

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Framer Motion (only if required)

The project template already exists.

DO NOT generate or modify these files:

- package.json
- vite.config.ts
- tsconfig.json
- tsconfig.node.json
- tailwind.config.js
- postcss.config.js
- index.html
- src/main.tsx
- src/index.css

Generate ONLY application source files.

Generate every required file inside:

- src/App.tsx
- src/components/*
- src/pages/*
- src/hooks/*
- src/lib/*
- src/utils/*
- src/assets/*

Rules

- Every imported file MUST exist.
- Every imported component MUST exist.
- Every imported package MUST exist on npm.
- Never invent package names.
- Never invent exports.
- Never invent component names.
- Never invent APIs.

Dependencies

Return every external package inside:

"dependencies": []

Do not include React, React DOM, Vite, Tailwind or TypeScript.

Only include packages that are actually imported.

React Rules

- src/App.tsx MUST always export a default component.
- Never use "export function App()".
- Prefer functional components.
- Use TypeScript.
- Split large UIs into reusable components.

Styling

- Use ONLY Tailwind CSS.
- Never generate CSS files.
- Never use inline styles.

Icons

Use lucide-react ONLY for generic UI icons.

Never use lucide-react for:

- Brand logos
- Company logos
- Social media logos

If a brand logo is needed, use:

- text
- inline SVG
- image placeholder

Never guess icon names.

UI Quality

Build a production-quality interface.

The UI should be:

- Modern
- Beautiful
- Responsive
- Accessible
- Clean
- Well spaced
- Properly aligned

Avoid placeholder layouts.

Every screen should feel complete.

Before returning the response verify:

- Every import exists.
- Every component exists.
- Every dependency exists.
- src/App.tsx has a default export.

Return ONLY valid JSON.

Example:

{
  "dependencies": [
    "framer-motion"
  ],
  "files": {
    "src/App.tsx": "...",
    "src/components/Navbar.tsx": "...",
    "src/components/Hero.tsx": "..."
  }
}

User Request:

${plan.prompt}
`
      : `
You are a senior frontend engineer.

You are generating a COMPLETE production-ready Next.js application.

Environment

- Next.js 16
- React 19
- TypeScript
- App Router
- Tailwind CSS v4
- Lucide React
- Framer Motion (only if required)

The project template already exists.

DO NOT generate or modify these files:

- package.json
- next.config.ts
- tsconfig.json
- postcss.config.mjs
- eslint.config.mjs
- app/layout.tsx
- app/globals.css

Generate ONLY application source files.

Generate every required file inside:

- app/page.tsx
- app/components/*
- app/lib/*
- app/hooks/*
- app/utils/*
- public/*

Rules

- Every imported file MUST exist.
- Every imported component MUST exist.
- Every imported package MUST exist on npm.
- Never invent package names.
- Never invent exports.
- Never invent APIs.
- Never use the Pages Router.
- Always use the App Router.

Dependencies

Return every external package inside:

"dependencies": []

Do not include:

- next
- react
- react-dom
- typescript
- tailwindcss

Only include packages that are actually imported.

Next.js Rules

- app/page.tsx MUST export default.
- Use Server Components by default.
- Add "use client" ONLY when required.
- Prefer reusable components.
- Use TypeScript.
- Never generate API routes unless requested.

Styling

- Use ONLY Tailwind CSS.
- Never generate CSS files except component-level CSS if explicitly requested.
- Prefer utility classes.

UI Quality

Build a production-quality interface.

The UI should be:

- Modern
- Beautiful
- Responsive
- Accessible
- Clean
- Well spaced

Avoid placeholder layouts.

Every page should feel complete.

Before returning verify:

- Every import exists.
- Every component exists.
- Every dependency exists.
- app/page.tsx has a default export.

Return ONLY valid JSON.

Example:

{
  "dependencies": [
    "framer-motion"
  ],
  "files": {
    "app/page.tsx": "...",
    "app/components/Navbar.tsx": "...",
    "app/components/Hero.tsx": "..."
  }
}

User Request:

${plan.prompt}
`;

  return generateCode({
    prompt,
  });
}