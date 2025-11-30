
'use client';

import { NodeProps } from '@xyflow/react';
import { BaseTriggerNode } from '../base-trigger-node';
import { memo, useState } from 'react';
import { GoogleFormTriggerDialog } from './dialog';
import { useNodeStatus } from '@/features/executions/hooks/use-node-status';
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/google-form-trigger';
import { fetchGoogleFormTriggerRealtimeToken } from './actions';


export const GoogleFormTriggerNode = memo((props: NodeProps) => {  // aka const GoogleFormTrigger
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
        icon='/logos/googleform.svg'
        width={64}
        height={64}
        name="Google Form Trigger"
        description="Executes Workflow upon submission of a Google Form"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});
