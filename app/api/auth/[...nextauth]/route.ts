// File: app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    // This sets up the login with a username and password
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is where you check the user's login details.
        // For this example, we will use a hardcoded user.
        // You can change "admin" and "password123" to whatever you want.

        if (credentials?.email === 'admin' && credentials?.password === 'password123') {
          // Any object returned here will be saved in the session
          return { id: '1', name: 'Admin User', email: 'admin@example.com' };
        } else {
          // If you return null, authentication will fail
          return null;
        }
      }
    })
  ],
  // Direct users to our custom login page
  pages: {
    signIn: '/login',
  },
  // You must provide a secret for security
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };