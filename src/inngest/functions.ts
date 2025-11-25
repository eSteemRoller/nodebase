
import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";


export const executeWorkflow = inngest.createFunction(
  { id: 'execute-workflow' },
  { event: 'workflows/executeWorkflow.workflow' },
  async ({ event, step }) => { 
    const workflowId = event.data.workflowId;

    if (!workflowId) { 
      throw new NonRetriableError("Workflow Id not found");
    }

    const nodes = await step.run('prepare-workflow', async () => { 
      const workflow = await prisma.workflow.findUniqueOrThrow({ 
        where: { id: workflowId },
        include: { 
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    return { nodes };
  },
);
