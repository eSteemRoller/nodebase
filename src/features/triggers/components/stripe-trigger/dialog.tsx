
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


interface Props { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const StripeTriggerDialog = ({ 
  open,
  onOpenChange
}: Props) => { 
  const params = useParams();
  const workflowId = params.workflowId as string;

  // Construct the webhook URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:80';
  const webhookUrl = 
    `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

  const copyToClipboard = async () => { 
    try { 
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Success: Webhook URL copied to clipboard");
    } catch { 
      toast.error("Failure: Webhook URL failed to copy to clipboard");
    }
  };

  return ( 
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Stripe Trigger Configuration
          </DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Stripe account 
            to trigger this Workflow when one or more Stripe  
            events occur.
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
              <li>Copy the Webhook URL above.</li>
              <li>Login to your Stripe account and open your 
                Stripe Dashboard.</li>
              <li>Click on the "Developers" menu near the bottom left corner.</li>
              <li>Click on "Webhooks."</li>
              <li>Click on the "Add destination" button.</li>
              <li>Select the events you want to listen for 
                <p>&emsp;(e.g., payment_intent.succeeded).</p></li>
              <li>Leave the Destination type, "Webhook endpoint," selected and 
                <p>&emsp;click on "Continue" near the lower left corner.</p></li>
              <li>Paste the copied Webhook URL into Stripe's "Endpoint URL" 
                <p>&emsp;field.</p></li>
              <li>Edit the other Stripe fields as necessary.</li>
              <li>Click on the "Create destination" button.</li>
              <li>Click on "Close Workbench" near the lower right corner.</li>
            </ol>
          </div>
          <div className='rounded-lg 
            bg-muted
            p-4
            space-y-2' 
          >
            <h4 className='font-medium text-sm'>Some Available Variables</h4>
            <ul className='text-sm text-muted-foreground space-y-1'>
              <li>
                <code className='bg-background 
                  px-1 
                  py-0.5 
                  rounded'
                >
                  {'{{stripe.eventType}}'}
                </code>
                <p>(format all responses as JSON)</p>
                <p> - Event type (e.g., payment_intent.succeeded)</p>
              </li>
              <li>
                <code className='bg-background 
                  px-1 
                  py-0.5 
                  rounded'
                >
                  {'{{stripe.amount}}'}
                </code>
                <p>(format all responses as JSON)</p>
                <p> - Payment amount</p>
              </li>
              <li>
                <code className='bg-background 
                  px-1 
                  py-0.5 
                  rounded'
                >
                  {'{{stripe.currency}}'}
                </code>
                <p>(format all responses as JSON)</p>
                <p> - Currency code</p>
              </li>
              <li>
                <code className='bg-background 
                  px-1 
                  py-0.5 
                  rounded'
                >
                  {'{{stripe.customerId}}'}
                </code>
                <p>(format all responses as JSON)</p>
                <p> - Customer Id</p>
              </li>
              <li>
                <code className='bg-background 
                  px-1 
                  py-0.5 
                  rounded'
                >
                  {'{{json.stripe}}'}
                </code>
                <p>(format all responses as JSON)</p>
                <p> - Full event data in JSON format</p>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}