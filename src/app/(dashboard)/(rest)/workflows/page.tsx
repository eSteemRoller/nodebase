
import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth-utils';
import { HydrateClient, prefetch } from '@/trpc/server';
import { prefetchWorkflows } from '@/features/workflows/server/prefetch';
import { ErrorBoundary } from 'react-error-boundary';
import { WorkflowsList } from '@/features/workflows/components/workflows';


const Page = async () => { 
  await requireAuth();

  prefetchWorkflows();

  return ( 
    <HydrateClient>
      <ErrorBoundary fallback={<p>Error!</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          <WorkflowsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
};

export default Page;