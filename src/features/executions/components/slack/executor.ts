
import type { NodeExecutor } from '@/features/executions/types';
import { NonRetriableError } from 'inngest';
import Handlebars from 'handlebars';
import { decode } from 'html-entities';
import { slackExecutionChannel } from '@/inngest/channels/slack-execution';
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

type SlackExecutionData = { 
  variableNodeName?: string;
  webhookUrl?: string;
  content?: string;
};

export const slackExecutionExecutor: NodeExecutor<SlackExecutionData> = async({ 
  // userId,
  data,
  nodeId,
  context,
  step,
  publish,
}) => { 
  await publish( 
    slackExecutionChannel().status({ 
      nodeId,
      status: 'loading',
    }),
  );

  if (!data.content) { 
    await publish( 
      slackExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError("Slack Execution node: post content not found");
  };

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  try { 
    const result = await step.run('slack-webhook', async () => { 
      if (!data.webhookUrl) { 
        await publish( 
          slackExecutionChannel().status({ 
            nodeId,
            status: 'error',
          }),
        );
        throw new NonRetriableError("Slack Execution node: webook URL not found");
      };

      await ky.post(data.webhookUrl, { 
        json: { 
          content: content,  // The prop name depends on the Workflow "Key" prop name in Slack (BTW, Discord's default prop name is "content")
        },
      });

      if (!data.variableNodeName) { 
        await publish( 
          slackExecutionChannel().status({ 
            nodeId,
            status: 'error',
          }),
        );
        throw new NonRetriableError("Slack Execution node: Variable Node Name not found");
      };

      return { 
        ...context,
        [data.variableNodeName]: { 
          slackMessageSent: true,  // or: messageContent: content.slice(0, 2000),
        },
      };
    });
    
    await publish( 
      slackExecutionChannel().status({ 
        nodeId,
        status: 'success',
      }),
    );

    return result;
  } catch (error) {
    await publish( 
      slackExecutionChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw error;
  };

};
