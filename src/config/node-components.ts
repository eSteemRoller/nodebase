
import { NodeType } from "@/generated/prisma";
// React Flow begin:
import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/initial-node";


export const nodeComponents = { 
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
// React Flow end
