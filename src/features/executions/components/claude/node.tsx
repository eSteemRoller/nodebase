
'use client';

import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '@/features/executions/components/base-execution-node';
import { ClaudeExecutionFormValues, ClaudeExecutionDialog } from './dialog';  // aka OpenAiFormValues, OpenAiDialog
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchClaudeExecutionRealtimeToken } from './actions';
import { CLAUDE_EXECUTION_CHANNEL_NAME } from '@/inngest/channels/claude';


type ClaudeExecutionNodeData = {  // aka OpenAINodeData
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
  // [key: string]: unknown;
};

type ClaudeExecutionNodeType = Node<ClaudeExecutionNodeData>;

export const ClaudeExecutionNode = memo(
  (props: NodeProps<ClaudeExecutionNodeType>) => { 
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({ 
    nodeId: props.id,
    channel: CLAUDE_EXECUTION_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchClaudeExecutionRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: ClaudeExecutionFormValues) => { 
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
  const descriptionModel = nodeData?.userPrompt  // aka const description
    ? `claude-sonnet-4-0: ${nodeData.userPrompt
        .slice(0, 50)}...`
    : "Not configured";
  // const descriptionModel = nodeData?.userPrompt  // aka const description
  //   ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt
  //       .slice(0, 50)
  //     }...`
  //   : "Not configured";
  

  return ( 
    <>
      <ClaudeExecutionDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode 
        {...props}
        id={props.id}
        icon='/logos/claude.svg'
        name="Claude AI"
        status={nodeStatus}
        description={descriptionModel} // {descriptionName}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

ClaudeExecutionNode.displayName = "ClaudeExecutionNode";
