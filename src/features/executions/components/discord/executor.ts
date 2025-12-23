
import type { NodeExecutor } from '@/features/executions/types';
import { NonRetriableError } from 'inngest';
import Handlebars from 'handlebars';
import { decode } from 'html-entities';
import { discordExecutionChannel } from '@/inngest/channels/discord';
import ky from 'ky';


Handlebars.registerHelper('json', (context) => {
  // directly returning "JSON.stringify(context, null, 2);" causes "&quot" parse error (because of HTML encoding when rendering the form?)
  try { 
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  } catch (error) { 
    throw new Error(`Failed to serialize context to JSON: ${error instanceof Error}.`);
  }
});

type DiscordExecutionData = { 
  variableNodeName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const discordExecutionExecutor: NodeExecutor<DiscordExecutionData> = async({ 
  // userId,
  data,
  nodeId,
  context,
  step,
  publish,
}) => { 
  await publish( 
    discordExecutionChannel().status({ 
      nodeId,
      status: 'loading',
    }),
  );

  if (!data.content) { 
    await publish( 
      discordExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("Discord Execution node: post content not found");
  };

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try { 
    const result = await step.run('discord-webhook', async () => { 
      if (!data.webhookUrl) { 
        await publish( 
          discordExecutionChannel().status({ 
            nodeId,
            status: 'error',
          }),
        );
        throw new NonRetriableError("Discord Execution node: webook URL not found");
      };

      await ky.post(data.webhookUrl!, { 
        json: { 
          content: content.slice(0, 2000),  // Discord's post character max
          username,
        }
      });

      if (!data.variableNodeName) { 
        await publish( 
          discordExecutionChannel().status({ 
            nodeId,
            status: 'error',
          }),
        );
        throw new NonRetriableError("Discord Execution node: Variable Node Name not found");
      };

      return { 
        ...context,
        [data.variableNodeName]: { 
          discordMessageSent: true,  // or: messageContent: content.slice(0, 2000),
        },
      };
    });
    
    await publish( 
      discordExecutionChannel().status({ 
        nodeId,
        status: 'success',
      }),
    );

    return result;
  } catch (error) {
    await publish( 
      discordExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw error;
  };

};
