export const ENVIRONMENT_PROMPT = `
You are running inside an E2B Sandbox.

Current directory:

/home/user

Rules:

- Never use absolute paths.
- Always create files using relative paths.
- Never modify package.json manually.
- Never create CSS files.
- Styling must always use Tailwind.
`;