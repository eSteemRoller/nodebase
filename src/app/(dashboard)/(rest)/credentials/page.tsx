
import React, { Suspense } from 'react';
import { requireAuth } from '@/lib/auth-utils';
import { SearchParams } from 'nuqs';
import { credentialsParamsLoader } from '@/features/credentials/server/params-loader';
import { prefetchAllCredentials } from '@/features/credentials/server/prefetch';
import { HydrateClient } from '@/trpc/server';
import { ErrorBoundary } from 'react-error-boundary';
import { CredentialsContainer, CredentialsError, CredentialsList, CredentialsLoading } from '@/features/credentials/components/credentials';


type Props = { 
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => { 
  await requireAuth();

  const params = await credentialsParamsLoader(searchParams);
  prefetchAllCredentials(params);

  return (
    <CredentialsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialsError />}>
          <Suspense fallback={<CredentialsLoading />}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialsContainer>
  );
};

export default Page;
