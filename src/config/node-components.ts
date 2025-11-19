
import { NodeType } from "@/generated/prisma";
// React Flow begin:
import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/initial-node";


export const nodeComponents = { 
  [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
// React Flow end
