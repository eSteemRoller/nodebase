


import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";


type Input = inferInput<typeof trpc.workflows.getMany>;

/*
** Prefetch all Workflows
*/
export const prefetchAllWorkflows = (params: Input) => {  // aka prefetchWorkflows
  return prefetch(trpc.workflows.getMany.queryOptions(params));
};

/*
** Prefetch a Workflow by ID
*/
export const prefetchWorkflow = (id: string) => { 
  return prefetch(trpc.workflows.getOne.queryOptions({id}));
};
