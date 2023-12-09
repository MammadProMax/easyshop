import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";

import { db } from "./db";

export const {
   handlers: { GET, POST },
   auth,
} = NextAuth({
   adapter: PrismaAdapter(db),
   secret: process.env.NEXTAUTH_SECRET!,
   providers: [
      github({
         clientId: process.env.GITHUB_CLIENT_ID!,
         clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
      google({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
   ],
   callbacks: {
      session: ({ user, session }) => {
         session.user.id = user.id;
         return session;
      },
   },
});
