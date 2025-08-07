import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client/edge"; // Use the edge client
import CredentialsProvider from "next-auth/providers/credentials"; // Example provider, add others as needed

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Add your authentication providers here, e.g.:
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add your logic here to find and validate the user
        // based on the credentials.
        // Return a user object if successful, null otherwise.
        return null; // Replace with your user authentication logic
      },
    }),
  ],
  // Add other NextAuth options as needed, e.g., session management, pages, etc.
  session: {
    strategy: "jwt", // Using JWT for edge compatibility
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // Specify pages for sign-in, error, etc. if you have custom ones
  // pages: {
  //   signIn: '/auth/signin',
  //   error: '/auth/error',
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
