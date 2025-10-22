
// import { z } from 'zod';
import prisma from '@/lib/db';
import { baseProcedure, createTRPCRouter } from '../init';


export const appRouter = createTRPCRouter({
  getUsers: baseProcedure
    // .input(
    //   z.object({
    //     text: z.string(),
    //   }),
    // )
    .query(() => {
      return prisma.user.findMany();
    }),
});


// export type definition of API
export type AppRouter = typeof appRouter;