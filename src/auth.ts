import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginMutation } from "./features/auth/actions/mutations";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (credentials?.email || !credentials?.password) {
          throw new Error("invalid credentials");
        }
        const data = await loginMutation(credentials);

        return {
          id: data.user.id,
          user: data.user,
          accessToken: data.token,
        };
      },
    }),
  ],
  callbacks: {
    // can add secure data since it hash the data
    jwt: ({ token, user }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user.user;
      }
      // always return token data
      return token;
    },
    // works on clint no secure data and works after jwt
    session: ({ token, session }) => {
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
