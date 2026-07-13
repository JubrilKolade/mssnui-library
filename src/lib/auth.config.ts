import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/types";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
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
  },
  providers: [],
} satisfies NextAuthConfig;
