import { inngest } from "../client";

export const generateProject = inngest.createFunction(
  {
    id: "generate-project",
    triggers: {
      event: "project/generate",
    },
    retries: 2,
  },
  async ({ event, step }) => {
    const prompt = await step.run(
      "extract-user-prompt",
      async () => {
        return event.data.prompt;
      }
    );

    console.log("Prompt:", prompt);

    return {
      success: true,
      prompt,
    };
  }
);