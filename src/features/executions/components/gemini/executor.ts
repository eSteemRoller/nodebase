
import type { NodeExecutor } from '@/features/executions/types';
import { NonRetriableError } from 'inngest';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import Handlebars from 'handlebars';
import { geminiExecutionChannel } from '@/inngest/channels/gemini';
import prisma from '@/lib/db';


Handlebars.registerHelper('json', (context) => {
  // directly returning "JSON.stringify(context, null, 2);" causes "&quot" parse error (because of HTML encoding when rendering the form?)
  try { 
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  } catch (error) { 
    throw new Error(`Failed to serialize context to JSON: ${error instanceof Error}.`);
  }
});

type GeminiExecutionData = { 
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt: string;
};

export const geminiExecutionExecutor: NodeExecutor<GeminiExecutionData> = async({ 
  data,
  nodeId,
  context,
  step,
  publish,
}) => { 
  await publish( 
    geminiExecutionChannel().status({ 
      nodeId,
      status: 'loading',
    }),
  );

  if (!data.variableName) { 
    await publish( 
      geminiExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("Gemini AI Execution node: Variable Name is required");
  }

  const credential = await step.run('get-credential', () => { 
    return prisma.credential.findUnique({ 
      where: { 
        id: data.credentialId,
      },
    });
  });

  if (!credential) { 
    await publish( 
      geminiExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("Gemini AI Execution node: Credential (API Key) is required");
  }

  if (!credential) { 
    await publish( 
      geminiExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("Gemini AI Execution node: Credential (API Key) not found");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  if (!data.userPrompt) { 
    await publish( 
      geminiExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("Gemini AI Execution node: User prompt is required");
  }

    // const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;

  const google = createGoogleGenerativeAI({ 
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap( 
      'google-generate-text',
      generateText,
      { 
        model: google("gemini-2.5-flash"),
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
      geminiExecutionChannel().status({ 
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
      geminiExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw error;
  }

};
