import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginMutation } from "./features/auth/server";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("invalid credentials");
        }

        const data = await loginMutation({
          username: credentials.username,
          password: credentials.password,
        });

        return {
          id: data.user.id,
          user: data.user,
          accessToken: data.token,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user, trigger, session }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user.user;
      }

      // `update({ accessToken })` is the only path that replaces the login token.
      if (
        trigger === "update" &&
        session &&
        typeof session.accessToken === "string"
      ) {
        token.accessToken = session.accessToken;
      }

      return token;
    },
    session: ({ token, session }) => {
      session.user = token.user;
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
