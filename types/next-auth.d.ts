// types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's custom role */
      role?: string | null;
    } & DefaultSession["user"];
  }
}