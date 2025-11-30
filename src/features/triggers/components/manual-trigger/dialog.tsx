
'use client';

import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';


interface Props { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ManualTriggerDialog = ({ 
  open,
  onOpenChange
}: Props) => { 
  return ( 
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Manual Workflow Execution Trigger Configuration
          </DialogTitle>
          <DialogDescription>
            Configure settings for this manual trigger
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <p className='text-sm text-muted-foreground'>
            Manual Trigger Settings:
          </p>
          <p className='text-sm text-muted-foreground'>
            No additional settings currently available.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}