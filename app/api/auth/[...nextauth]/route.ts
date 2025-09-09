import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * The main configuration object for NextAuth.js.
 * This is exported so it can be used by other parts of the application,
 * like API routes that need to verify the user's session.
 */
export const authOptions: NextAuthOptions = {
  session: {
    // Use JSON Web Tokens for session handling.
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      /**
       * This is the core function that verifies a user's credentials.
       * It's called when a user tries to sign in.
       */
      async authorize(credentials) {
        // 1. Ensure that username and password were provided.
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        // 2. Find the user in the database using their username.
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        // 3. If no user is found, reject the login.
        if (!user) {
          return null;
        }

        // 4. Compare the password from the form with the hashed password in the database.
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // 5. If the passwords do not match, reject the login.
        if (!isPasswordValid) {
          return null;
        }

        // 6. If everything is correct, return the user object (without the password).
        // This object is then used to create the session token.
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * This callback is executed whenever a JWT is created or updated.
     * We use it to add the user's role to the token.
     */
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    /**
     * This callback is executed whenever a session is accessed.
     * We use it to add the user's role from the token to the client-side session object.
     */
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

// The handler that processes all authentication-related requests.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };