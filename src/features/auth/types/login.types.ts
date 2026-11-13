import { z } from "zod";
import { createLoginSchema } from "../schemas/login.schema";
import { IUser } from "./auth.types";

export type TLoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export interface ILoginResponse {
  token: string;
  user: IUser;
}
