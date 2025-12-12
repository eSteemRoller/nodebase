
import type { NodeExecutor } from '@/features/executions/types';
import { NonRetriableError } from 'inngest';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import Handlebars from 'handlebars';
import { chatGptExecutionChannel } from '@/inngest/channels/chatgpt';


Handlebars.registerHelper('json', (context) => {
  // directly returning "JSON.stringify(context, null, 2);" causes "&quot" parse error (because of HTML encoding when rendering the form?)
  try { 
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  } catch (error) { 
    throw new Error(`Failed to serialize context to JSON: ${error instanceof Error}.`);
  }
});

type chatGptExecutionData = { 
  variableName?: string;
  systemPrompt?: string;
  userPrompt: string;
};

export const chatGptExecutionExecutor: NodeExecutor<chatGptExecutionData> = async({ 
  data,
  nodeId,
  context,
  step,
  publish,
}) => { 
  await publish( 
    chatGptExecutionChannel().status({ 
      nodeId,
      status: 'loading',
    }),
  );

  if (!data.variableName) { 
    await publish( 
      chatGptExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("ChatGPT AI Execution node: Variable Name is missing");
  }

  if (!data.userPrompt) { 
    await publish( 
      chatGptExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("ChatGPT AI Execution node: User prompt is missing");
  }

  // To Do: Throw error if credential is missing

  
  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // To Do: Fetch credential that user selected

  const credentialValue = process.env.OPENAI_API_KEY!;

  const openAi = createOpenAI({  // aka openai
    apiKey: credentialValue,
  });

  try {
    const { steps } = await step.ai.wrap( 
      'chatgpt-generate-text',
      generateText,
      { 
        model: openAi('gpt-4'),  // aka openai
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: { 
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const text = 
      steps[0].content[0].type === 'text'
        ? steps[0].content[0].text
        : '';
    
    await publish( 
      chatGptExecutionChannel().status({ 
        nodeId,
        status: 'success',
      }),
    );

    return { 
      ...context,
      [data.variableName]: { 
        text,
      },
    }
  } catch (error) {
    await publish( 
      chatGptExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw error;
  }

};
