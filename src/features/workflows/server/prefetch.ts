


import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";


type Input = inferInput<typeof trpc.workflows.getMany>;

/*
** Prefetch all Workflows util
*/
export const prefetchWorkflows = (params: Input) => { 
  return prefetch(trpc.workflows.getMany.queryOptions(params));
};

/*
** Prefetch a Workflow util
*/
export const prefetchWorkflow = (id: string) => { 
  return prefetch(trpc.workflows.getOne.queryOptions({id}));
};
