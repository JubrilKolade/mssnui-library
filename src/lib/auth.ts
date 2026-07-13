import "server-only";

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { Role } from "@/types";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  const { PrismaAdapter } = await import("@auth/prisma-adapter");
  const { prisma } = await import("./prisma");

  return {
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        allowDangerousEmailAccountLinking: true,
      }),
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              role: true,
              avatar: true,
              isActive: true,
              departmentId: true,
            },
          });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          if (!user.password) {
            throw new Error("Please sign in with Google");
          }

          if (!user.isActive) {
            throw new Error("Your account has been deactivated");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.avatar,
          };
        },
      }),
    ],
    callbacks: {
      ...authConfig.callbacks,
      async jwt({ token, user, trigger, session }) {
        if (user) {
          token.id = user.id as string;
          const role = (user as { role?: Role }).role;
          if (role) token.role = role;
        }

        if (trigger === "update" && session) {
          token.name = session.name;
          token.role = session.role;
          token.picture = session.image;
        }

        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, isActive: true, avatar: true },
          });

          if (dbUser) {
            token.role = dbUser.role;
            token.isActive = dbUser.isActive;
            if (dbUser.avatar) token.picture = dbUser.avatar;
          }
        }

        return token;
      },
      async session({ session, token }) {
        if (token && session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as Role;
          session.user.isActive = token.isActive as boolean;
          session.user.image = token.picture as string;
        }
        return session;
      },
      async signIn({ user, account }) {
        try {
          if (account?.provider === "google") {
            const existingUser = await prisma.user.findUnique({
              where: { email: user.email! },
            });

            if (existingUser) {
              if (!existingUser.isActive) {
                return false;
              }
              if (!existingUser.avatar && user.image) {
                await prisma.user.update({
                  where: { id: existingUser.id },
                  data: { avatar: user.image },
                });
              }
              return true;
            }

            return true;
          }

          if (account?.provider === "credentials") {
            return true;
          }

          return false;
        } catch {
          return false;
        }
      },
    },
    events: {
      async createUser({ user }) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: "member",
            avatar: user.image,
          },
        });
      },
    },
  };
});
