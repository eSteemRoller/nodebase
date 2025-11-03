
import { checkout, polar, portal } from '@polar-sh/better-auth';
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from './polar';


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: { 
      enabled: true,
      autoSignIn: true,
    },
    plugins: [ 
      polar({ 
        client: polarClient,
        createCustomerOnSignUp: true,
        use: [ 
          checkout({ 
            products: [
              { 
                productId: 'e4d60148-f065-4ab9-b66e-761a4a0e73ff',
                slug: 'Nodebase-Pro',
              }
            ],
            successUrl: process.env.POLAR_SUCCESS_URL,
            authenticatedUsersOnly: true,
          }),
          portal()
        ],
      })
    ]
});