import { z } from "zod";
import { createConfirmEmailSchema } from "../schemas/confirm-email.schema";

export type TConfirmEmailFormValues = z.infer<
  ReturnType<typeof createConfirmEmailSchema>
>;

// Endpoint returns a message-only Success response (no payload).
export type IConfirmEmailResponse = null;
