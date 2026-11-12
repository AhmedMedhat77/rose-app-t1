import { z } from "zod";

export function createChangePasswordSchema(messages: {
  required: string;
  passwordMinLength: string;
  passwordUppercase: string;
  passwordLowercase: string;
  passwordNumber: string;
  passwordSpecial: string;
  passwordSameAsOld: string;
  passwordsDoNotMatch: string;
}) {
  return z
    .object({
      oldPassword: z.string().min(1, messages.required),
      newPassword: z
        .string()
        .min(8, messages.passwordMinLength)
        .regex(/[A-Z]/, messages.passwordUppercase)
        .regex(/[a-z]/, messages.passwordLowercase)
        .regex(/[0-9]/, messages.passwordNumber)
        .regex(/[\W_]/, messages.passwordSpecial),
      confirmNewPassword: z.string().min(1, messages.required),
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      error: messages.passwordSameAsOld,
      path: ["newPassword"],
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      error: messages.passwordsDoNotMatch,
      path: ["confirmNewPassword"],
    });
}
