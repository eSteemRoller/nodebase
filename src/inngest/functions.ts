
import { NonRetriableError } from 'inngest';
import { inngest } from './client';
import prisma from '@/lib/db';
import { topologicalSort } from './utils';
import { NodeType } from '@/generated/prisma';
import { getExecutor } from '@/features/executions/lib/executor-registry';
import type { NodeExecutor } from '@/features/executions/types';
import { httpRequestChannel } from './channels/http-request';
import { manualTriggerChannel } from './channels/manual-trigger';
import { googleFormTriggerChannel } from './channels/google-form-trigger';
import { stripeTriggerChannel } from './channels/stripe-trigger';
import { geminiExecutionChannel } from './channels/gemini';
import { chatGptExecutionChannel } from './channels/chatgpt';
import { claudeExecutionChannel } from './channels/claude';


export const executeWorkflow = inngest.createFunction(
  { 
    id: 'execute-workflow',
    retries: 0,  // To Do: Remove this line in production
  },
  { 
    event: 'workflows/executeWorkflow.workflow',  // aka execute.workflow
    channels: [ 
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiExecutionChannel(),
      chatGptExecutionChannel(),
      claudeExecutionChannel(),
    ]
  },
  async ({ event, step, publish }) => { 
    const workflowId = event.data.workflowId;

    if (!workflowId) { 
      throw new NonRetriableError("Workflow Id not found");
    }

    const sortedNodes = await step.run('prepare-workflow', async () => { 
      const workflow = await prisma.workflow.findUniqueOrThrow({ 
        where: { id: workflowId },
        include: { 
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    // Initialize context with any initial data from the trigger
    let context = event.data.initialData || {};

    // Execute each node
    for (const node of sortedNodes) {
      // Cast executor to a generic NodeExecutor to avoid TypeScript errors
      // caused by the registry returning executors with different specific
      // data shapes. We validate/handle specific node types where needed.
      const executor = getExecutor(node.type as NodeType) as unknown as NodeExecutor<any>;

      // Call executor with the node data as `any` — this keeps runtime
      // behavior while avoiding overly strict compile-time checks. For
      // higher safety, validate `node.data` shape per node.type before
      // invoking the executor.
      context = await executor({
        data: node.data as any,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    return { 
      workflowId,
      result: context,
    };
  },
);
