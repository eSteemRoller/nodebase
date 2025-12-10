import { NodeType } from '@/generated/prisma';
import { NodeExecutor } from '../types';
import { manualTriggerExecutor } from '@/features/triggers/components/manual-trigger/executor';
import { httpRequestExecutor } from '../components/http-request/executor';
import { googleFormTriggerExecutor } from '@/features/triggers/components/google-form-trigger/executor';
import { stripeTriggerExecutor } from '@/features/triggers/components/stripe-trigger/executor';
import { geminiExecutionExecutor } from '../components/gemini/executor';


type ExecutorMap = {
  [NodeType.MANUAL_TRIGGER]: typeof manualTriggerExecutor;
  [NodeType.INITIAL]: typeof manualTriggerExecutor;
  [NodeType.HTTP_REQUEST]: typeof httpRequestExecutor;
  [NodeType.GOOGLE_FORM_TRIGGER]: typeof googleFormTriggerExecutor;
  [NodeType.STRIPE_TRIGGER]: typeof stripeTriggerExecutor;
  [NodeType.GEMINI_EXECUTION]: typeof geminiExecutionExecutor;
  [NodeType.OPENAI_EXECUTION]: typeof geminiExecutionExecutor;  // To Do: Fix
  [NodeType.ANTHROPIC_EXECUTION]: typeof geminiExecutionExecutor;  // To Do: Fix
};

export const executorRegistry: ExecutorMap = { 
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor, 
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI_EXECUTION]: geminiExecutionExecutor,
  [NodeType.OPENAI_EXECUTION]: geminiExecutionExecutor,  // To Do: Fix
  [NodeType.ANTHROPIC_EXECUTION]: geminiExecutionExecutor,  // To Do: Fix
};

export const getExecutor = <T extends NodeType>(type: T): ExecutorMap[T] => { 
  const executor = executorRegistry[type];
  if (!executor) { 
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};
