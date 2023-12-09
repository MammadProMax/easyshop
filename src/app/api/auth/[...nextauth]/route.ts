import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";

const handler = NextAuth({
   adapter: PrismaAdapter(db),
   providers: [
      Github({
         clientId: process.env.GITHUB_CLIENT_ID!,
         clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
      Google({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      Credentials({
         credentials: {
            email: {
               label: "Email",
               type: "text",
            },
            password: { label: "Password", type: "password" },
         },
         authorize(credentials, req) {
            return {
               id: "asdasd",
               email: credentials?.email,
               image: "asdasd",
            };
         },
      }),
   ],
   session: {
      strategy: "jwt",
   },
});

export { handler as GET, handler as POST };
