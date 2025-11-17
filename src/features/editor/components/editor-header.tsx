
'use client';

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SaveIcon } from "lucide-react";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";


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

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => { 
  return ( 
    <div className="ml-auto">
      <Button size="sm" onClick={() => {}} disabled={false}>
        <SaveIcon className="size-4 " />
        Save
      </Button>
    </div>
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
