
import { useTRPC } from "@/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";
// import { Workflow, WorkflowsAll } from "../types";


/*
** Hook to fetch all Workflows using Suspense
*/
export const useSuspenseWorkflows = () => { 
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();
  const allWorkflows = useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));

  return allWorkflows;
};

/*
** Hook to create a Workflow
*/
export const useCreateWorkflow = () => { 
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.create.mutationOptions({ 
      onSuccess: (data) => { 
        toast.success(`New Workflow, "${data.name}," has been created`); 
        queryClient.invalidateQueries( 
          trpc.workflows.getMany.queryOptions({}),
        );
      },
      onError: (error) => { 
        toast.error(`Failed to create new Workflow, "${error.message}"`);
      },
    }),
  )
};

/*
** Hook to remove a Workflow
*/
export const useRemoveWorkflow = () => { 
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation( 
    trpc.workflows.remove.mutationOptions({ 
      onSuccess: (data) => { 
        toast.success(`Workflow, "${data.name}," has been deleted`); 
        queryClient.invalidateQueries( 
          trpc.workflows.getOne.queryFilter({ id: data.id }),
        );
      },
      onError: (error) => { 
        toast.error(`Failed to delete Workflow, "${error.message}"`);
      },
    }),
  )
};

