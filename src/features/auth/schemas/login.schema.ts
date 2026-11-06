import { z } from "zod";

export function createLoginSchema(messages: {
  usernameRequired: string;
  passwordRequired: string;
}) {
  return z.object({
    userName: z.string().trim().min(1, messages.usernameRequired),
    password: z.string().min(1, messages.passwordRequired),
  });
}
