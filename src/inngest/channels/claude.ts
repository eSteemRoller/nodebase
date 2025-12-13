
import { channel, topic } from '@inngest/realtime';

export const CLAUDE_EXECUTION_CHANNEL_NAME = 'claude-execution';  // aka ANTHROPIC_CHANNEL_NAME

export const claudeExecutionChannel = channel(CLAUDE_EXECUTION_CHANNEL_NAME)  // aka anthropicChannel
  .addTopic( 
    topic('status').type<{ 
      nodeId: string;
      status: 'loading' | 'success' | 'error';
    }>(),
);


