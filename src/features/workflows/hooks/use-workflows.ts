
import { useTRPC } from "@/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";
import { Workflow, WorkflowsResponse } from "../types";


/*
** Hook to fetch all Workflows using Suspense
*/
export const useSuspenseWorkflows = () => { 
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();

  return useSuspenseQuery<WorkflowsResponse>(trpc.workflows.getMany.queryOptions(params));
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

