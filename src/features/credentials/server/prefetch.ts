


import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";


type Input = inferInput<typeof trpc.credentials.getMany>;

/*
** Prefetch all Credentials
*/
export const prefetchAllCredentials = (params: Input) => {  // aka prefetchCredentials
  return prefetch(trpc.credentials.getMany.queryOptions(params));
};

/*
** Prefetch a Credential by ID
*/
export const prefetchCredential = (id: string) => { 
  return prefetch(trpc.credentials.getOne.queryOptions({id}));
};
