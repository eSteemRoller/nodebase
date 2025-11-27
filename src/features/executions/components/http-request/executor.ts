
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from 'ky';


type HttpRequestData = { 
  variableName?: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
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

  if (!data.endpoint) { 
    // To Do: Publish 'error' state for http request
    throw new NonRetriableError("HTTP Request node: No endpoint configured.");
  };

  const result = await step.run('http-request', async () => { 
    const endpoint = data.endpoint!;
    const method = data.method || 'GET';

    const options: KyOptions = { method };

    if (['POST', 'PUT', 'PATCH'].includes(method)) { 
      options.headers = { 
        'Content-Type': 'application/json',
      };
      options.body = data.body;
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

    if (data.variableName) { 
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    };

    // Fallback to direct httpResponse for backward compatibility
    return { 
      ...context,
      ...responsePayload,
    };
  });

  // const result = await step.fetch(data.endpoint);

  // To Do: Publish 'success' state for http request

  return result;
};
