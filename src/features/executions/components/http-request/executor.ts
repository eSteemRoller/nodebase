
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from 'ky';
import Handlebars from 'handlebars';
import { httpRequestChannel } from "@/inngest/channels/http-request";


Handlebars.registerHelper('json', (context) => {
  // directly returning "JSON.stringify(context, null, 2);" causes "&quot" parse error (because of HTML encoding when rendering the form?)
  try { 
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  } catch (error) { 
    throw new Error(`Failed to serialize context to JSON: ${error instanceof Error}.`);
  }
});

type HttpRequestData = { 
  variableNodeName?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint?: string;
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async({ 
  data,
  nodeId,
  context,
  step,
  publish,
}) => { 
    await publish( 
      httpRequestChannel().status({ 
        nodeId,
        status: 'loading',
      }),
    );
  

  try {
    const result = await step.run('http-request', async () => { 

      if (!data.variableNodeName) { 
        await publish( 
          httpRequestChannel().status({ 
            nodeId,
            status: 'error',
          }),
        );
        throw new NonRetriableError("HTTP Request node: No Variable Node Name configured.");
      };

      if (!data.method) { 
        await publish( 
          httpRequestChannel().status({ 
            nodeId,
            status: 'error',
          }),
        );
        throw new NonRetriableError("HTTP Request node: No Method configured.");
      };

      if (!data.endpoint) { 
        await publish( 
          httpRequestChannel().status({ 
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
        [data.variableNodeName]: responsePayload,
      }
    });

    await publish( 
        httpRequestChannel().status({ 
          nodeId,
          status: 'success',
        }),
      );

    return result;
  } catch (error) { 
    await publish( 
      httpRequestChannel().status({ 
        nodeId,
        status: 'error',
      }),
    );
    throw error;
  }
};
