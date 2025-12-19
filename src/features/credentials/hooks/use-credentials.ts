
import { useTRPC } from '@/trpc/client';
import { TRPCClientError } from '@trpc/client';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCredentialsParams } from './use-credentials-params';
import { CredentialType } from '@/generated/prisma';


/*
** Hook to fetch all Credentials using Suspense
*/
export const useSuspenseCredentials = () => { 
  const trpc = useTRPC();
  const [params] = useCredentialsParams();
  const allCredentials = useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));

  return allCredentials;
};

/*
** Hook to create a Credential
*/
export const useCreateCredential = () => { 
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    trpc.credentials.create.mutationOptions({ 
      onSuccess: (data) => { 
        toast.success(`Success: New Credential "${data.name}" has been created`); 
        queryClient.invalidateQueries( 
          trpc.credentials.getMany.queryOptions({}),
        );
        router.push('/credentials/');
      },
      onError: (error) => { 
        toast.error(`Failure: Failed to create Credential ${error.message}`);
      },
    }),
  );
};

/*
** Hook to delete a Credential
*/
export const useRemoveCredential = () => { 
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation( 
    trpc.credentials.delete.mutationOptions({ 
      onSuccess: (data) => { 
        toast.success(`Success: Credential "${data.name}" has been deleted`); 
        queryClient.invalidateQueries( 
          trpc.credentials.getOne.queryFilter({ id: data.id }),
        );
        router.push('/credentials/');
      },
      onError: (error) => { 
        toast.error(`Failure: Failed to delete Credential ${error.message}`);
      },
    }),
  );
};

/*
** Hook to fetch a Credential by ID using Suspense
*/
export const useSuspenseCredential = (id: string) => { 
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
};

/*
** Hook to update the current Credential
*/
export const useUpdateCredential = () => { 
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    trpc.credentials.updateCredential.mutationOptions({  // aka credentials.update
      onSuccess: (data) => { 
        toast.success(`Success: Credential "${data.name}" saved`); 
        queryClient.invalidateQueries( 
          trpc.credentials.getOne.queryOptions({ id: data.id }),
        );
        router.push('/credentials/');
      },
      onError: (error) => { 
        toast.error(`Failure: Failed to save Credential ${error.message}`);
      },
    }),
  );
};

/*
** Hook to fetch Credentials by type
*/
export const useCredentialsByType = (type: CredentialType) => { 
  const trpc = useTRPC();
  return useQuery(trpc.credentials.getByType.queryOptions({ type }));
};
