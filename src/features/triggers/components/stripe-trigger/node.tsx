
'use client';

import { NodeProps } from '@xyflow/react';
import { BaseTriggerNode } from '../base-trigger-node';
import { memo, useState } from 'react';
import { StripeTriggerDialog } from './dialog';
import { useNodeStatus } from '@/features/executions/hooks/use-node-status';
import { STRIPE_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/stripe-trigger';
import { fetchStripeTriggerRealtimeToken } from './actions';


export const StripeTriggerNode = memo((props: NodeProps) => {  // aka const n/a
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({ 
      nodeId: props.id,
      channel: STRIPE_TRIGGER_CHANNEL_NAME,
      topic: 'status',
      refreshToken: fetchStripeTriggerRealtimeToken,
    });

  const handleOpenSettings = () => setDialogOpen(true);

  return ( 
    <>
      <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
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
