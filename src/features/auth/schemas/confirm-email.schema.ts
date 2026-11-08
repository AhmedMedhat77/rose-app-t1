import { z } from "zod";

export const CONFIRM_EMAIL_CODE_LENGTH = 6;

export function createConfirmEmailSchema(messages: {
  emailInvalid: string;
  codeRequired: string;
  codeLength: string;
}) {
  return z.object({
    email: z.email({ error: messages.emailInvalid }),
    code: z
      .string()
      .min(1, messages.codeRequired)
      .length(CONFIRM_EMAIL_CODE_LENGTH, messages.codeLength),
  });
}
