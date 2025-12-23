
'use server';

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { discordExecutionChannel } from "@/inngest/channels/discord";
import { inngest } from "@/inngest/client";


export type DiscordExecutionToken = Realtime.Token< 
  typeof discordExecutionChannel, 
  ['status']
>;

export async function fetchDiscordExecutionRealtimeToken():Promise<DiscordExecutionToken> { 
  const token = await getSubscriptionToken(inngest, { 
    channel: discordExecutionChannel(),
    topics: ['status'],
  });

  return token;
};
