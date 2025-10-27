
'use client';

import { LogoutButton } from "./logout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";



const Page = () => { 
  const trpc = useTRPC();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(trpc.createWorkflow.mutationOptions());

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-8">
      protected server component
      <div>
        {JSON.stringify(data, null, 2)}
      </div>
      <Button onClick={() => create.mutate()}>
        Create workflow
      </Button>
      <LogoutButton />
    </div>
  );
};

export default Page;
