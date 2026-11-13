import { z } from "zod";

export function createSendEmailVerificationSchema(messages: {
  emailInvalid: string;
}) {
  return z.object({
    email: z.email({ error: messages.emailInvalid }),
  });
}
