
'use client';

import { formatDistanceToNow } from 'date-fns';
import { useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials"
import { 
  EmptyView,
  EntityContainer, 
  EntityHeader, 
  EntityItem, 
  EntityList, 
  EntityPagination, 
  EntitySearch, 
  ErrorView, 
  LoadingView
} from "@/components/entity-components";
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { UseEntitySearch } from "../hooks/use-entity-search";
import type { Credential  } from "@/generated/prisma";
import { CredentialType } from "@/generated/prisma";
import Image from 'next/image';


export const CredentialsSearch = () => { 
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = UseEntitySearch({ 
    params,
    setParams,
  });

  return ( 
    <EntitySearch 
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Credentials"
    />
  );
};

export const CredentialsList = () => { 
  // throw new Error('test')

  const credentials = useSuspenseCredentials();

  return ( 
    <EntityList 
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialItem data={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

export const CredentialsHeader = ({ disabled } : { disabled?: boolean }) => { 
  return ( 
    <EntityHeader 
      title="Credentials"
      description="Create and Edit your Credentials"
      newButtonHref='/credentials/new'
      newButtonLabel="New Credential"
      disabled={disabled}
    />
  );
};

export const CredentialsContainer = ({ 
  children
}: { 
  children: React.ReactNode;
}) => { 
  return ( 
    <EntityContainer 
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsPagination = () => { 
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return ( 
    <EntityPagination 
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      page={credentials.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const CredentialsLoading = () => { 
  return <LoadingView message="Loading Credentials..." />;
};

export const CredentialsError = () => { 
  return <ErrorView message="Error loading Credentials..." />;
};

export const CredentialsEmpty = () => { 
  const router = useRouter();

  const handleCreate = () => { 
    router.push('/credentials/new');
  };

  return ( 
    <EmptyView 
      onNew={handleCreate}
      message='No Credentials found or created yet. Create your first Credential or adjust your search.'
    />
  );
};

const credentialLogos: Record<CredentialType, string> = { 
  [CredentialType.CHATGPT_EXECUTION]: '/logos/chatgpt.svg',
  [CredentialType.CLAUDE_EXECUTION]: '/logos/chatgpt.svg',
  [CredentialType.GEMINI_EXECUTION]: '/logos/chatgpt.svg'
};

export const CredentialItem = ({ 
  data,

}: { 
    data: Credential 
  }) => { 
    const removeCredential = useRemoveCredential();

    const handleRemove = () => { 
      removeCredential.mutate({ id: data.id });
    }
  
  const logo = credentialLogos[data.type] || '/logos/gemini.svg';  // aka /openai.svg

  return ( 
    <EntityItem 
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={ 
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={ 
        <div className="size-8 flex justify-center items-center">
          <Image src={logo} alt={data.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  )
}
