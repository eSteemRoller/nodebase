
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from 'ky';
import Handlebars from 'handlebars';
import { geminiChannel } from "@/inngest/channels/gemini";


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
  model: 
    'gemini-1.5-flash'|
    'gemini-1.5-flash-8b'|
    'gemini-1.5-pro'|
    'gemini-1.0-pro'|
    'gemini-pro'|
    undefined
  ;
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
  

  try {
    const result = await step.run('gemini', async () => { 

      if (!data.variableName) { 
        await publish( 
          geminiChannel().status({ 
            nodeId,
            status: 'error',
          }),
        );
        throw new NonRetriableError("HTTP Request node: No Variable Name configured.");
      };

      if (!data.method) { 
        await publish( 
          geminiChannel().status({ 
            nodeId,
            status: 'error',
          }),
        );
        throw new NonRetriableError("HTTP Request node: No Method configured.");
      };

      if (!data.endpoint) { 
        await publish( 
          geminiChannel().status({ 
            nodeId,
            status: 'error',
          }),
        );
        throw new NonRetriableError("HTTP Request node: No Endpoint configured.");
      };

      const endpoint = Handlebars.compile(data.endpoint)(context);
      const method = data.method;

      const options: KyOptions = { method };

      if (['POST', 'PUT', 'PATCH'].includes(method)) { 
        const resolved = Handlebars.compile(data.body || '{}')(context);
        JSON.parse(resolved);
        options.headers = { 
          'Content-Type': 'application/json',
        };
        options.body = resolved;
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get('content-type');
      const responseData = contentType?.includes('application/json') 
        ? await response.json()
        : await response.text();

      const responsePayload = { 
        httpResponse: { 
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };

      return {
        ...context,
        [data.variableName]: responsePayload,
      }
    });

    await publish( 
        geminiChannel().status({ 
          nodeId,
          status: 'success',
        }),
      );

    return result;
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
