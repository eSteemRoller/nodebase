
import type { NodeExecutor } from '@/features/executions/types';
import { NonRetriableError } from 'inngest';
import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import Handlebars from 'handlebars';
import { claudeExecutionChannel } from '@/inngest/channels/claude';
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

type ClaudeExecutionData = { 
  variableNodeName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt: string;
};

export const claudeExecutionExecutor: NodeExecutor<ClaudeExecutionData> = async({ 
  userId,
  data,
  nodeId,
  context,
  step,
  publish,
}) => { 
  await publish( 
    claudeExecutionChannel().status({ 
      nodeId,
      status: 'loading',
    }),
  );

  if (!data.variableNodeName) { 
    await publish( 
      claudeExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("Claude AI Execution node: Variable Node Name is required");
  }

  const credential = await step.run('get-credential', () => { 
    return prisma.credential.findUnique({ 
      where: { 
        userId,
        id: data.credentialId,
      },
    });
  });

  if (!credential) { 
    await publish( 
      claudeExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("Gemini AI Execution node: Credential (API Key) is required");
  }

  if (!credential) { 
    await publish( 
      claudeExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("Gemini AI Execution node: Credential (API Key) not found");
  }

  if (!data.userPrompt) { 
    await publish( 
      claudeExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("Claude AI Execution node: User prompt is required");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // const credentialValue = process.env.ANTHROPIC_API_KEY!;

  const anthropic = createAnthropic({ 
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap( 
      'anthropic-generate-text',
      generateText,
      { 
        model: anthropic("claude-sonnet-4-0"), 
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
      claudeExecutionChannel().status({ 
        nodeId,
        status: 'success',
      }),
    );

    return { 
      ...context,
      [data.variableNodeName]: { 
        text,
      },
    }
  } catch (error) {
    await publish( 
      claudeExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw error;
  }

};
