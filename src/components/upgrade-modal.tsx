
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
            Upgrade to Pro
            <AlertDialogDescription>
              An active subsription is required for this action. 
              Upgrade to Pro to unlock all features.
            </AlertDialogDescription>
          </AlertDialogTitle>
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
