
'use client';

import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '@/features/executions/components/base-execution-node';
import { ChatGptFormValues, ChatGptDialog } from './dialog';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchGeminiRealtimeToken } from './actions';
import { GEMINI_CHANNEL_NAME } from '@/inngest/channels/gemini';


type ChatGptNodeData = {  // aka OpenAINodeData
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
  // [key: string]: unknown;
};

type ChatGptNodeType = Node<ChatGptNodeData>;

export const ChatGptExecutionNode = memo(
  (props: NodeProps<ChatGptNodeType>) => { 
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({ 
    nodeId: props.id,
    channel: GEMINI_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchGeminiRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: ChatGptFormValues) => { 
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
    ? `gpt-4: ${nodeData.userPrompt
        .slice(0, 50)}...`
    : "Not configured";
  // const descriptionModel = nodeData?.userPrompt  // aka const description
  //   ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt
  //       .slice(0, 50)
  //     }...`
  //   : "Not configured";
  

  return ( 
    <>
      <ChatGptDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode 
        {...props}
        id={props.id}
        icon='/logos/chatgpt.svg'
        name="ChatGPT AI"
        status={nodeStatus}
        description={descriptionModel} // {descriptionName}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

ChatGptExecutionNode.displayName = "ChatGPTNode";
