
import { channel, topic } from '@inngest/realtime';

export const CHATGPT_EXECUTION_CHANNEL_NAME = 'chatgpt-execution';  // aka OPENAI_CHANNEL_NAME

export const chatGptExecutionChannel = channel(CHATGPT_EXECUTION_CHANNEL_NAME)  // aka openAiChannel
  .addTopic( 
    topic('status').type<{ 
      nodeId: string;
      status: 'loading' | 'success' | 'error';
    }>(),
);


