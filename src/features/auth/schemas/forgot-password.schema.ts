import { z } from "zod";

export function createForgotPasswordSchema(messages: { emailInvalid: string }) {
  return z.object({
    email: z.email({ error: messages.emailInvalid }),
  });
}
