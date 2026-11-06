import { z } from "zod";

export function createSendEmailVerificationSchema(messages: {
  emailInvalid: string;
}) {
  return z.object({
    email: z.email({ error: messages.emailInvalid }),
  });
}

export function createConfirmEmailVerificationSchema(messages: {
  emailInvalid: string;
  codeRequired: string;
  codeLength: string;
}) {
  return z.object({
    email: z.email({ error: messages.emailInvalid }),
    code: z.string().length(6, messages.codeLength),
  });
}
