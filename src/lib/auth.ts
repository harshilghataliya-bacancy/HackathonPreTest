import NextAuth from "next-auth";
import { prisma } from "./prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: true,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      const email = user.email;
      if (!email) return false;

      if (!email.endsWith("@bacancy.com")) {
        return "/unauthorized";
      }

      try {
        await prisma.user.upsert({
          where: { email },
          update: {
            name: user.name || "",
            avatarUrl: user.image || null,
          },
          create: {
            email,
            name: user.name || "",
            avatarUrl: user.image || null,
            role: "USER",
          },
        });
      } catch (error) {
        console.error("[AUTH] Prisma upsert error:", error);
      }

      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error("[AUTH] JWT callback DB error:", error);
        }
      }
      return token;
    },
  },
});
