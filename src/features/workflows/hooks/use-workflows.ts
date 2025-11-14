
import { useTRPC } from "@/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";
import { Workflow, WorkflowsAll } from "../types";


/*
** Hook to fetch all Workflows using Suspense
*/
export const useSuspenseWorkflows = () => { 
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();
  const allWorkflows = useSuspenseQuery<WorkflowsAll>(trpc.workflows.getMany.queryOptions(params));

  return allWorkflows;
};

/*
** Hook to create a new Workflow
*/
export const useCreateWorkflow = () => { 
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return (
    useMutation<Workflow, TRPCClientError<any>, void>(
      trpc.workflows.create.mutationOptions({ 
        onSuccess: (data: Workflow) => { 
          toast.success(`New Workflow, ${data.name}, has been created`); 
          queryClient.invalidateQueries( 
            trpc.workflows.getMany.queryOptions({}),
          );
        },
        onError: (error: TRPCClientError<any>) => { 
          toast.error(`Failed to create new Workflow: ${error.message}`);
        },
      }),
    )
  )
};

