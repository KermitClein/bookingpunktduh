import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import EmailProvider from "@auth/core/providers/email";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    })
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
