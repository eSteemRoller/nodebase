
'use server';

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { claudeExecutionChannel } from "@/inngest/channels/claude";
import { inngest } from "@/inngest/client";


export type ClaudeExecutionToken = Realtime.Token< 
  typeof claudeExecutionChannel, 
  ['status']
>;

export async function fetchClaudeExecutionRealtimeToken():Promise<ClaudeExecutionToken> { 
  const token = await getSubscriptionToken(inngest, { 
    channel: claudeExecutionChannel(),
    topics: ['status'],
  });

  return token;
};
