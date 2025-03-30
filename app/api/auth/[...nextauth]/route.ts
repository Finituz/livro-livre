import NextAuth, { AuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

export const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
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
  },
});
export { handler as GET, handler as POST };
