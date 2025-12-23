
'use client';

import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '@/features/executions/components/base-execution-node';
import { DiscordExecutionFormValues, DiscordExecutionDialog } from './dialog';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchDiscordExecutionRealtimeToken } from './actions';
import { DISCORD_EXECUTION_CHANNEL_NAME } from '@/inngest/channels/discord';


type DiscordExecutionNodeData = { 
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type DiscordExecutionNodeType = Node<DiscordExecutionNodeData>;

export const DiscordExecutionNode = memo(
  (props: NodeProps<DiscordExecutionNodeType>) => { 
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({ 
    nodeId: props.id,
    channel: DISCORD_EXECUTION_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchDiscordExecutionRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: DiscordExecutionFormValues) => { 
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
      <DiscordExecutionDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode 
        {...props}
        id={props.id}
        icon='/logos/discord.svg'
        name="Discord"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

DiscordExecutionNode.displayName = "DiscordExecutionNode";
