
import { NodeType } from '@/generated/prisma';
// React Flow begin:
import type { NodeTypes } from '@xyflow/react';
import { InitialNode } from '@/components/initial-node';
import { HttpRequestNode } from '@/features/executions/components/http-request/node';
import { ManualTriggerNode } from '@/features/triggers/components/manual-trigger/node';
import { GoogleFormTriggerNode } from '@/features/triggers/components/google-form-trigger/node';
import { StripeTriggerNode } from '@/features/triggers/components/stripe-trigger/node';
import { GeminiExecutionNode } from '@/features/executions/components/gemini/node';


export const nodeComponents = { 
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,  // aka GoogleFormTrigger
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,  // aka n/a
  [NodeType.GEMINI_EXECUTION]: GeminiExecutionNode,  // aka .GEMINI]: GeminiNode
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
// React Flow end
