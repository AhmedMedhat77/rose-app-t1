import { z } from "zod";

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "validation.required" }),
    newPassword: z
      .string()
      .min(8, { message: "validation.password_min_length" })
      .regex(/[A-Z]/, { message: "validation.password_uppercase" })
      .regex(/[a-z]/, { message: "validation.password_lowercase" })
      .regex(/[0-9]/, { message: "validation.password_number" })
      .regex(/[\W_]/, { message: "validation.password_special" }),
    confirmNewPassword: z.string().min(1, { message: "validation.required" }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword === data.oldPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "validation.password_same_as_old",
        path: ["newPassword"],
      });
    }
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "validation.passwords_do_not_match",
        path: ["confirmNewPassword"],
      });
    }
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
