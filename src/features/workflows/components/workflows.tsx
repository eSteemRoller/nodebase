
'use client';

import { boolean } from "zod";
import { useSuspenseWorkflows } from "../hooks/use-workflows"
import { EntityContainer, EntityHeader } from "@/components/entity-components";


export const WorkflowsList = () => { 
  const workflows = useSuspenseWorkflows();

  return ( 
    <p>
      {JSON.stringify(workflows.data, null, 2)}
    </p>
  );
};

export const WorkflowsHeader = ({ disabled } : { disabled?: boolean }) => { 
  return ( 
    <>
      <EntityHeader 
        title="Workflows"
        description="Create and Edit your Workflows"
        onNew={() => {}}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={false}
      />
    </>
  )
};

export const WorkflowsContainer = ({ 
  children
}: { 
  children: React.ReactNode;
}) => { 
  return ( 
    <EntityContainer 
      header={<WorkflowsHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  )
}
