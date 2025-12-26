
'use client';

import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '@/features/executions/components/base-execution-node';
import { SlackExecutionFormValues, SlackExecutionDialog } from './dialog';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchSlackExecutionRealtimeToken } from './actions';
import { SLACK_EXECUTION_CHANNEL_NAME } from '@/inngest/channels/slack-execution';


type SlackExecutionNodeData = { 
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type SlackExecutionNodeType = Node<SlackExecutionNodeData>;

export const SlackExecutionNode = memo(
  (props: NodeProps<SlackExecutionNodeType>) => { 
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({ 
    nodeId: props.id,
    channel: SLACK_EXECUTION_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchSlackExecutionRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: SlackExecutionFormValues) => { 
    setNodes((nodes) => nodes.map((node) => { 
      if (node.id == props.id) { 
        return { 
          ...node,
          data: { 
            ...node.data,
            ...values,
          }
        }
      }
      return node;
    }))
  };
  
  const nodeData = props.data;
  const description = nodeData?.content  // aka const description
    ? `Send: ${nodeData.content
        .slice(0, 50)}...`
    : "Not configured";

  return ( 
    <>
      <SlackExecutionDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode 
        {...props}
        id={props.id}
        icon='/logos/slack.svg'
        name="Slack"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

SlackExecutionNode.displayName = "SlackExecutionNode";
