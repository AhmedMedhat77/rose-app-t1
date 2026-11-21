import { z } from "zod";

export function createApplyCouponSchema(messages: { codeRequired: string }) {
  return z.object({
    code: z.string().trim().min(1, messages.codeRequired),
  });
}
