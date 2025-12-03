
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:80';
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
      <DialogContent className="w-full max-w-lg">
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
        <div className='overflow-auto max-h-[65vh] space-y-4'>
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
              <li>Login to your Google account and open your Google Form.</li>
              <li>Click on the ellipsis (...) menu near the top right corner.</li>
              <li>Click on "Apps Script."</li>
              <li>Click the "Copy Google Apps Script" button below.</li>
              <li>Paste the script in the scriptwriting area, completely overwriting the "myFunction" default script function template.</li>
              <li>To the right of "WEBHOOK_URL" verify if the current webhook URL is the one you want to use.</li>
              <li>If the "WEBHOOK_URL" is missing or problematic, you can replace "webhookUrl" with the webhook URL above (without quotes).</li>
              <li>Click on the floppy disk icon to "Save project to Drive."</li>
              <li>Click on "Triggers" (the clock icon) in the left slideout menu.</li>
              <li>Click on the "Add Trigger" button near the bottom right corner.</li>
              <li>Verify the trigger settings.</li>
              <li>For this example, we are using the event source, "From form," the event type, "On form submit," and the failure notification setting, "Notify me immediately."</li>
              <li>Click on the "Save" button.</li>
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
              This script includes the Webhook URL above and it 
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