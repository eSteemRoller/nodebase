
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { generateSlug } from 'random-word-slugs';


export const workflowsRouter = createTRPCRouter({ 
  create: protectedProcedure.mutation(({ ctx }) => { 
    return prisma.workflow.create({ 
      data: { 
        name: generateSlug(3),
        userId: ctx.auth.user.id,
      },
    });
  }),
});