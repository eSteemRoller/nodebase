
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from 'ky';
import Handlebars from 'handlebars';


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
  variableName: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async({ 
  data,
  nodeId,
  context,
  step,
}) => { 
  // To Do: Publish 'loading' state for http request

  if (!data.variableName) { 
    // To Do: Publish 'error' state for http request
    throw new NonRetriableError("HTTP Request node: No Variable Name configured.");
  };

  if (!data.method) { 
    // To Do: Publish 'error' state for http request
    throw new NonRetriableError("HTTP Request node: No Method configured.");
  };

  if (!data.endpoint) { 
    // To Do: Publish 'error' state for http request
    throw new NonRetriableError("HTTP Request node: No Endpoint configured.");
  };

  const result = await step.run('http-request', async () => { 
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

  // const result = await step.fetch(data.endpoint);

  // To Do: Publish 'success' state for http request

  return result;
};
