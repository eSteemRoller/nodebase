
'use client';

import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  
  
  AlertDialogFooter,
  
  
} from '@/components/ui/alert-dialog';
import { authClient } from '@/lib/auth-client';


interface UpgradeModalProps { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const UpgradeModal = ({ 
  open, 
  onOpenChange 
}: UpgradeModalProps) => { 
  return( 
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <p className='mb-4'>Upgrade account to 'Pro' subscription</p>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p>An active 'Pro' subsription is required for this action.</p> 
            <p className='mb-4'>Upgrade to 'Pro' to unlock all features.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => authClient.checkout({ slug: 'pro' })}
          >
            Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
};
