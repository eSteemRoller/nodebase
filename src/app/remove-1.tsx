
'use client';

import { LogoutButton } from "./remove-2";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";



const Page = () => { 
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(trpc.createWorkflow.mutationOptions({  
    onSuccess: () => { 
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    },
  }));

  const testAI = useMutation(trpc.testAI.mutationOptions({ 
    onSuccess: () => { 
      toast.success('AI job queued')
    },
  }));

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-8">
      protected server component
      <div>
        {JSON.stringify(data, null, 2)}
      </div>
      <Button disabled={testAI.isPending} onClick={() => testAI.mutate()}>
        Test AI
      </Button>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create workflow
      </Button>
      <LogoutButton />
    </div>
  );
};

export default Page;
