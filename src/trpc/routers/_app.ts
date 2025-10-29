
// import { z } from 'zod';
import prisma from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '../init';
import { inngest } from '@/inngest/client';
// import { email } from 'zod';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';


export const appRouter = createTRPCRouter({ 
  testAI: protectedProcedure
    .mutation(async () => { 
      await inngest.send({
        name: 'execute/ai',
      });

      return { success: true, message: 'Job queued' };
  }),
  getWorkflows: protectedProcedure
    .query(({ ctx }) => { 
      console.log({ 
        userId: ctx.auth.user.id 
      });

      return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure
    .mutation(async () => { 
      await inngest.send({ 
        name: 'test/hello.world',
        data: { 
          email: 'JohnD@email.com',
        },
      });

      return prisma.workflow.create({ 
        data: { 
          name: 'test-workflow'
        },
      });
  }),
});


// export type definition of API
export type AppRouter = typeof appRouter;