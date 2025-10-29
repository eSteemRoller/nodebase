
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";


const google = createGoogleGenerativeAI();
const openAI = createOpenAI();
const anthropic = createAnthropic();

export const executeAI = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {

    // await step.sleep("wait-a-moment", "5s");

    const { steps: geminiSteps } = await step.ai.wrap( 
      'gemini-generate-text', 
      generateText, 
      { 
        model: google('gemini-2.5-flash'),
        system: 'You are a helpful assistant.',
        prompt: 'What is 2 + 2?' 
      }
    );
    
    const { steps: openAISteps } = await step.ai.wrap( 
      'openAI-generate-text', 
      generateText, 
      { 
        model: openAI('gpt-4'),
        system: 'You are a helpful assistant.',
        prompt: 'What is 2 + 2?' 
      }
    );

    const { steps: anthropicSteps } = await step.ai.wrap( 
      'anthropic-generate-text', 
      generateText, 
      { 
        model: anthropic('claude-sonnet-4-5'),
        system: 'You are a helpful assistant.',
        prompt: 'What is 2 + 2?' 
      }
    );

    return { 
      geminiSteps,
      openAISteps,
      anthropicSteps
    };

  },
);
