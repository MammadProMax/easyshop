import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import Credencials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

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
      Credencials({
         credentials: {
            email: { label: "Email" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            const user = await db.user.findUnique({
               where: {
                  email: <string>credentials.email,
               },
            });
            if (!user) return null;

            const isPasswordCorrect = await bcrypt.compare(
               <string>credentials.password,
               user.password!
            );
            if (!isPasswordCorrect) return null;

            return user;
         },
      }),
   ],
   session: {
      strategy: "jwt",
   },
   callbacks: {
      session: ({ token, session }) => {
         session.user.id = <string>token.uid;
         return session;
      },
      jwt({ user, token }) {
         if (user) {
            token.uid = user.id;
         }

         return token;
      },
   },
   pages: {
      signIn: "/login",
      newUser: "/",
   },
});
