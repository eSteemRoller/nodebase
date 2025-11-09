
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


/*
** Hook to fetch all Workflows using Suspense
*/
export const useSuspenseWorkflows = () => { 
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
}

/*
** Hook to create a new Workflow
*/
export const useCreateWorkflow = () => { 
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return (
    useMutation(
      trpc.workflows.create.mutationOptions({ 
        onSuccess: (data) => { 
          toast.success(`New Workflow, ${data.name},  has been created`);
          queryClient.invalidateQueries( 
            trpc.workflows.getMany.queryOptions(),
          );
        },
        onError: (error) => { 
          toast.error(`Failed to create new Workflow: ${error.message}`);
        },
      }),
    )
  )
};

