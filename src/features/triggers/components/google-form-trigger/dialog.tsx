
'use client';

import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CopyIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { generateGoogleFormScript } from './utils';


interface Props { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const GoogleFormTriggerDialog = ({ 
  open,
  onOpenChange
}: Props) => { 
  const params = useParams();
  const workflowId = params.workflowId as string;

  // Construct the webhook URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const webhookUrl = 
    `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

  const copyToClipboard = async () => { 
    try { 
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Success: Webhook URL copied to clipboard");
    } catch { 
      toast.error("Failure: Webhook URL NOT copied to clipboard");
    }
  };

  return ( 
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Google Form Trigger Configuration
          </DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Form's 
            Apps Script to trigger this Workflow when your 
            Google Form is submitted.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='webhook-url'>
              Webhook URL
            </Label>
            <div className='flex gap-2'>
              <Input 
                id='webhook-url'
                value={webhookUrl}
                readOnly
                className='font-mono text-sm'
              />
              <Button 
                type='button'
                size='icon'
                variant='outline'
                onClick={copyToClipboard}
              >
                <CopyIcon className='size-4' />
              </Button>
            </div>
          </div>

          <div className='rounded-lg 
            bg-muted 
            p-4 
            space-y-2'>
            <h4 className='font-medium text-sm'>
              Setup instructions:
            </h4>
            <ol className='text-sm 
              text-muted-foreground 
              space-y-1 
              list-decimal 
              list-inside'
            >
              <li>Open your Google Form</li>
              <li>Click on the ellipsis (...) menu</li>
              <li>Click on Script editor</li>
              <li>Click the Copy Google Apps Script button below</li>
              <li>To the right of "WEBHOOK_URL" replace "webhookUrl" with the webhook URL above (without quotes)</li>
              <li>Save your Script</li>
              <li>Click on "Triggers"</li>
              <li>Click on "Add Trigger"</li>
              <li>Click on "From form"</li>
              <li>Click on "On form submit"</li>
              <li>Save your Trigger</li>
            </ol>
          </div>
          <div className='rounded-lg 
            bg-muted 
            p-4 
            space-y-4'
          >
            <h4 className='font-medium text-sm'>
              Google Apps Script:
            </h4>
            <Button 
              type='button'
              variant='outline'
              onClick={async () => { 
                const script = generateGoogleFormScript(webhookUrl);
                try { 
                  await navigator.clipboard.writeText(script);
                  toast.success("Success: Script copied to clipboard")
                } catch { 
                  toast.error("Failure: Script NOT copied to clipboard")
                }
              }}
            >
              <CopyIcon className='size-4 mr-2' />
              Copy Google Apps Script
            </Button>
            <p className='text-xs text-muted-foreground'>
              This script includes your webhook URL and it 
              handles form submissions
            </p>
          </div>
          <div className='rounded-lg 
            bg-muted
            p-4
            space-y-2' 
          >
            <h4 className='font-medium text-sm'>Some Available Variables</h4>
            <ul className='text-sm text-muted-foreground space-y-2'>
              <li>
                <code className='bg-background 
                  px-2 
                  py-0.5 
                  rounded'
                >
                  {'{{googleForm.respondentEmail}}'}
                </code>
                (Respondent's e-mail)
              </li>
              <li>
                <code className='bg-background 
                  px-2 
                  py-0.5 
                  rounded'
                >
                  {'{{googleForm.responses["Question Name"]}}'}
                </code>
                (specific answer)
              </li>
              <li>
                <code className='bg-background 
                  px-2 
                  py-0.5 
                  rounded'
                >
                  {'{{json.googleForm.responses}}'}
                </code>
                (format all responses as JSON)
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}