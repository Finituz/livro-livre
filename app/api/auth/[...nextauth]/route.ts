import NextAuth, { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const options: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/docs",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 hours
  },
  callbacks: {
    // Define the `jwt` callback to include the access token in the JWT
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    // Define the `session` callback to attach the access token to the session
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string; // Ensure it's a string type
      }
      return session;
    },
  },
  pages: {
    error: "/auth/error", // Optional: Redirect to a custom error page
  },
  debug: process.env.NODE_ENV === "development", // Enable debugging in development environment
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
