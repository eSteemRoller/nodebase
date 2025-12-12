
'use server';

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { chatGptExecutionChannel } from "@/inngest/channels/chatgpt";
import { inngest } from "@/inngest/client";


export type ChatGptExecutionToken = Realtime.Token< 
  typeof chatGptExecutionChannel, 
  ['status']
>;

export async function fetchChatGptExecutionRealtimeToken():Promise<ChatGptExecutionToken> { 
  const token = await getSubscriptionToken(inngest, { 
    channel: chatGptExecutionChannel(),
    topics: ['status'],
  });

  return token;
};
