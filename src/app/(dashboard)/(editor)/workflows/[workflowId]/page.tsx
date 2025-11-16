
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { requireAuth } from '@/lib/auth-utils';
import { prefetchWorkflow } from '@/features/workflows/server/prefetch';
import { HydrateClient } from '@/trpc/server';


interface PageProps { 
  params: Promise <{ 
    workflowId: string;
  }>
};

const Page = async ({ params }: PageProps) => { 
  await requireAuth();
  const { workflowId }= await params;
  prefetchWorkflow(workflowId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Error</p>}>
        <Suspense fallback={<p>Loading...</p>}>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
};

export default Page;
