import { z } from "zod";

export function createLoginSchema(messages: {
  emailInvalid: string;
  passwordRequired: string;
}) {
  return z.object({
    email: z.email({ error: messages.emailInvalid }),
    password: z.string().min(1, messages.passwordRequired),
  });
}
