import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { adminDB } from "./firebase/admin";
import { FirestoreAdapter } from "@auth/firebase-adapter";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  adapter: FirestoreAdapter(adminDB),
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        if (token.sub) session.user.id = token.sub;
      }

      return session;
    },
  },
} satisfies NextAuthOptions;
