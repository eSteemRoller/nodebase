
'use client';

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SaveIcon } from "lucide-react";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRenameWorkflow, useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";


export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => { 
  return ( 
    <div className="ml-auto">
      <Button size="sm" onClick={() => {}} disabled={false}>
        <SaveIcon className="size-4 " />
        Save
      </Button>
    </div>
  )
};

// aka EditorNameInput
export const EditorWorkflowNameInput = ({ workflowId }: { workflowId: string }) => { 
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const renameWorkflow = useRenameWorkflow();
  // aka updateWorkflow = useUpdateWorkflowName

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { 
    if (workflow.name) { 
      setName(workflow.name);
    }
  }, []);

  return ( 
    <BreadcrumbItem className="cursor-pointer hover:text-foreground transition-colors hover:underline">
      {workflow.name}
    </BreadcrumbItem>
  )
}

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => { 
  return ( 
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="hover:underline">
            <Link prefetch href='/workflows'>
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorWorkflowNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  )
};

export const EditorHeader = ({ workflowId }: { workflowId: string }) => { 

  return ( 
    <header className="flex 
      h-16 
      shrink-0 
      items-center 
      gap-2 
      border-b 
      px-4 
      bg-background" 
    >
      <SidebarTrigger />
      <div className="flex flex-row justify-between items-center gap-x-4 w-full">
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  );
};
