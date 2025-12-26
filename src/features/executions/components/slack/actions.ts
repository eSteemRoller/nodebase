
'use server';

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { slackExecutionChannel } from "@/inngest/channels/slack-execution";
import { inngest } from "@/inngest/client";


export type SlackExecutionToken = Realtime.Token< 
  typeof slackExecutionChannel, 
  ['status']
>;

export async function fetchSlackExecutionRealtimeToken():Promise<SlackExecutionToken> { 
  const token = await getSubscriptionToken(inngest, { 
    channel: slackExecutionChannel(),
    topics: ['status'],
  });

  return token;
};
