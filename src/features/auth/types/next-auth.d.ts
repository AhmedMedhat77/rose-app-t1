import { IUser } from "./auth.types";

declare module "next-auth" {
  interface User {
    accessToken: string;
    user: IUser;
  }

  interface Session {
    user: IUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    user: IUser;
  }
}
