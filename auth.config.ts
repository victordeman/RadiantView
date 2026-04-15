import type { NextAuthConfig } from "next-auth"

export default {
  providers: [], // This will be expanded in auth.ts
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: { strategy: "jwt" },
  callbacks: {
    // Only includes callbacks that don't depend on Prisma
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedRoutes = ["/dashboard", "/patients", "/scheduling", "/orders", "/reports", "/viewer", "/analytics", "/admin"];
      const isProtected = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));

      if (isProtected) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
