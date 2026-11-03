import { z } from "zod";
import { loginSchema } from "../schemas/login.schema";
import { IUser } from "./auth";

export type TLoginFormValues = z.infer<typeof loginSchema>;

export interface ILoginResponse {
  token: string;
  user: IUser;
}
