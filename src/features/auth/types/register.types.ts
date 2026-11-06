import { z } from "zod";
import {
  createAccountDetailsSchema,
  createPasswordSchema,
  createRegisterSchema,
} from "../schemas/register.schema";
import {
  createSendEmailVerificationSchema,
  createConfirmEmailVerificationSchema,
} from "../schemas/email-verification.schema";
import { IUser } from "./auth.types";

export type TSendEmailVerificationValues = z.infer<
  ReturnType<typeof createSendEmailVerificationSchema>
>;
export type TConfirmEmailVerificationValues = z.infer<
  ReturnType<typeof createConfirmEmailVerificationSchema>
>;

export type TAccountDetailsValues = z.infer<
  ReturnType<typeof createAccountDetailsSchema>
>;

export type TCreatePasswordValues = z.infer<
  ReturnType<typeof createPasswordSchema>
>;
export type TRegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;

export interface ISendEmailVerificationResponse {
  message: string;
}

export interface IConfirmEmailVerificationResponse {
  message: string;
}

export interface IRegisterResponse {
  token: string;
  user: IUser;
}
