
'use client';

import { boolean } from "zod";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
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
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { UseEntitySearch } from "../hooks/use-entity-search";
import type { Workflow } from "@/generated/prisma";
import { WorkflowIcon } from "lucide-react";
import { WorkflowData, WorkflowsAll } from "../types";


export const WorkflowsSearch = () => { 
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = UseEntitySearch({ 
    params,
    setParams,
  });

  return ( 
    <EntitySearch 
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Workflows"
    />
  );
};

export const WorkflowsList = () => { 
  // throw new Error('test')

  const workflows = useSuspenseWorkflows();

  return ( 
    <EntityList 
      items={workflows.data.items}
      getKey={(workflow: WorkflowData) => workflow.id}
      renderItem={(workflow: WorkflowData) => <WorkflowItem data={workflow} />}
      emptyView={<WorkflowsEmpty />}
    />
  );
};

export const WorkflowsHeader = ({ disabled } : { disabled?: boolean }) => { 
  const createWorkflow = useCreateWorkflow();
  const router = useRouter();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => { 
    createWorkflow.mutate(undefined, { 
      onSuccess: (data: WorkflowData) => { 
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => { 
        handleError(error);
      },
    });
  };

  return ( 
    <>
      {modal}
      <EntityHeader 
        title="Workflows"
        description="Create and Edit your Workflows"
        onNew={handleCreate}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowsContainer = ({ 
  children
}: { 
  children: React.ReactNode;
}) => { 
  return ( 
    <EntityContainer 
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const WorkflowsPagination = () => { 
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return ( 
    <EntityPagination 
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      page={workflows.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const WorkflowsLoading = () => { 
  return <LoadingView message="Loading Workflows..." />;
};

export const WorkflowsError = () => { 
  return <ErrorView message="Error loading Workflows..." />;
};

export const WorkflowsEmpty = () => { 
  const createWorkflow = useCreateWorkflow();
  const router = useRouter();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => { 
    createWorkflow.mutate(undefined, { 
      onSuccess: (data: WorkflowData) => { 
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => { 
        handleError(error);
      },
    });
  };

  return ( 
    <>
      {modal}
      <EmptyView 
        onNew={handleCreate}
        message="No Workflows found or Created yet. 
          Create your first Workflow or adjust your Search."
      />
    </>
  );
};

export const WorkflowItem = ({ 
  data,

}: { 
    data: Workflow 
  }) => { 
    return ( 
      <EntityItem 
        href={`/workflows/${data.id}`}
        title={data.name}
        subtitle={ 
          <>
            Updated TODO{" "}
            &bull; Created{" "}
            TODO
          </>
        }
        image={ 
          <div className="size-8 flex justify-center items-center">
            <WorkflowIcon className="size=5 text-muted-foreground" />
          </div>
        }
        onRemove={() => {}}
        isRemoving={false}
      />
    )
}
