
import type { NodeExecutor } from '@/features/executions/types';
import { NonRetriableError } from 'inngest';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import Handlebars from 'handlebars';
import { geminiChannel } from '@/inngest/channels/gemini';


Handlebars.registerHelper('json', (context) => {
  // directly returning "JSON.stringify(context, null, 2);" causes "&quot" parse error (because of HTML encoding when rendering the form?)
  try { 
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  } catch (error) { 
    throw new Error(`Failed to serialize context to JSON: ${error instanceof Error}.`);
  }
});

type geminiData = { 
  variableName?: string;
  systemPrompt?: string;
  userPrompt: string;
};

export const geminiExecutionExecutor: NodeExecutor<geminiData> = async({ 
  data,
  nodeId,
  context,
  step,
  publish,
}) => { 
  await publish( 
    geminiChannel().status({ 
      nodeId,
      status: 'loading',
    }),
  );

  if (!data.variableName) { 
    await publish( 
      geminiChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("Gemini AI Execution node: Variable Name is missing");
  }

  if (!data.userPrompt) { 
    await publish( 
      geminiChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("Gemini AI Execution node: User prompt is missing");
  }

  // To Do: Throw error if credential is missing

  
  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // To Do: Fetch credential that user selected

  const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;

  const google = createGoogleGenerativeAI({ 
    apiKey: credentialValue,
  });

  try {
    const { steps } = await step.ai.wrap( 
      'gemini-generate-text',
      generateText,
      { 
        model: google('gemini-2.0-flash'),
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
      geminiChannel().status({ 
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
      geminiChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw error;
  }

};
