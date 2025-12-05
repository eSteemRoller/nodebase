
'use client';

import { NodeProps } from '@xyflow/react';
import { BaseTriggerNode } from '../base-trigger-node';
import { memo, useState } from 'react';
import { GoogleFormTriggerDialog } from './dialog';
import { useNodeStatus } from '@/features/executions/hooks/use-node-status';
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/google-form-trigger';
import { fetchGoogleFormTriggerRealtimeToken } from './actions';


export const StripeTriggerNode = memo((props: NodeProps) => {  // aka const n/a
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({ 
      nodeId: props.id,
      channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
      topic: 'status',
      refreshToken: fetchGoogleFormTriggerRealtimeToken,
    });

  const handleOpenSettings = () => setDialogOpen(true);

  return ( 
    <>
      <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode 
        {...props}
        icon='/logos/stripe.svg'
        width={64}
        height={64}
        name="Stripe Trigger"
        description="Executes Workflow when a Stripe event is detected/captured"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});
