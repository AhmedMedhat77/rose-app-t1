import { z } from "zod";

export const RESET_PASSWORD_MIN_LENGTH = 8;

export function createResetPasswordSchema(messages: {
  passwordRequired: string;
  passwordMin: string;
  confirmRequired: string;
  passwordsMismatch: string;
}) {
  return z
    .object({
      newPassword: z
        .string()
        .min(1, messages.passwordRequired)
        .min(RESET_PASSWORD_MIN_LENGTH, messages.passwordMin),
      confirmPassword: z.string().min(1, messages.confirmRequired),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      error: messages.passwordsMismatch,
    });
}
