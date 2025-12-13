
'use client';

import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '@/features/executions/components/base-execution-node';
import { GeminiExecutionFormValues, GeminiExecutionDialog } from './dialog';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchGeminiExecutionRealtimeToken } from './actions';
import { GEMINI_EXECUTION_CHANNEL_NAME } from '@/inngest/channels/gemini';


type GeminiExecutionNodeData = { 
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
  // [key: string]: unknown;
};

type GeminiExecutionNodeType = Node<GeminiExecutionNodeData>;

export const GeminiExecutionNode = memo(
  (props: NodeProps<GeminiExecutionNodeType>) => { 
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({ 
    nodeId: props.id,
    channel: GEMINI_EXECUTION_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchGeminiExecutionRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: GeminiExecutionFormValues) => { 
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
    ? `gemini-2.5-flash: ${nodeData.userPrompt
        .slice(0, 50)}...`
    : "Not configured";
  // const descriptionModel = nodeData?.userPrompt  // aka const description
  //   ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt
  //       .slice(0, 50)
  //     }...`
  //   : "Not configured";
  

  return ( 
    <>
      <GeminiExecutionDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode 
        {...props}
        id={props.id}
        icon='/logos/gemini.svg'
        name="Gemini AI"
        status={nodeStatus}
        description={descriptionModel} // {descriptionName}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

GeminiExecutionNode.displayName = "GeminiExecutionNode";
