
import { useTRPC } from "@/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";


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
        toast.error(`Failed to create Workflow: ${error.message}`);
      },
    }),
  );
};

/*
** Hook to delete a Workflow
*/
export const useRemoveWorkflow = () => { 
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation( 
    trpc.workflows.delete.mutationOptions({ 
      onSuccess: (data) => { 
        toast.success(`Workflow, "${data.name}," has been deleted`); 
        queryClient.invalidateQueries( 
          trpc.workflows.getOne.queryFilter({ id: data.id }),
        );
      },
      onError: (error) => { 
        toast.error(`Failed to delete Workflow: ${error.message}`);
      },
    }),
  );
};

/*
** Hook to fetch a Workflow by id using Suspense
*/
export const useSuspenseWorkflow = (id: string) => { 
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};

/*
** Hook to update/rename the current Workflow
*/
export const useRenameWorkflow = () => { // aka useUpdateWorkflowName
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.updateWorkflowName.mutationOptions({  // aka workflows.updateName
      onSuccess: (data) => { 
        toast.success(`Workflow renamed to "${data.name}."`); 
        queryClient.invalidateQueries( 
          trpc.workflows.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => { 
        toast.error(`Failed to rename Workflow: ${error.message}`);
      },
    }),
  );
};

/*
** Hook to update the current Workflow
*/
export const useUpdateWorkflow = () => { 
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.updateWorkflow.mutationOptions({  // aka workflows.update
      onSuccess: (data) => { 
        toast.success(`Workflow "${data.name}" saved.`); 
        queryClient.invalidateQueries( 
          trpc.workflows.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => { 
        toast.error(`Failed to save Workflow: ${error.message}`);
      },
    }),
  );
};

/*
** Hook to execute the current Workflow
*/
export const useExecuteWorkflow = () => { 
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.executeWorkflow.mutationOptions({  // aka workflows.execute
      onSuccess: (data) => { 
        toast.success(`Workflow "${data.name}" executed.`); 
      },
      onError: (error) => { 
        toast.error(`Failed to execute Workflow: ${error.message}`);
      },
    }),
  );
};
