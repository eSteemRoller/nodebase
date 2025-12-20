
'use client';

import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '@/features/executions/components/base-execution-node';
import { ChatGptExecutionFormValues, ChatGptExecutionDialog } from './dialog';  // aka OpenAiFormValues, OpenAiDialog
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchChatGptExecutionRealtimeToken } from './actions';
import { CHATGPT_EXECUTION_CHANNEL_NAME } from '@/inngest/channels/chatgpt';


type ChatGptExecutionNodeData = {  // aka OpenAINodeData
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
  // [key: string]: unknown;
};

type ChatGptExecutionNodeType = Node<ChatGptExecutionNodeData>;

export const ChatGptExecutionNode = memo(
  (props: NodeProps<ChatGptExecutionNodeType>) => { 
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({ 
    nodeId: props.id,
    channel: CHATGPT_EXECUTION_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchChatGptExecutionRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: ChatGptExecutionFormValues) => { 
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
    ? `gpt-4.1: ${nodeData.userPrompt
        .slice(0, 50)}...`
    : "Not configured";
  // const descriptionModel = nodeData?.userPrompt  // aka const description
  //   ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt
  //       .slice(0, 50)
  //     }...`
  //   : "Not configured";
  

  return ( 
    <>
      <ChatGptExecutionDialog 
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

ChatGptExecutionNode.displayName = "ChatGPTExecutionNode";
