import { z } from "zod";
import { createResetPasswordSchema } from "../schemas/reset-password.schema";

export type TResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;

export type TResetPasswordPayload = TResetPasswordFormValues & {
  token: string;
};

// Endpoint returns a message-only Success response (no payload).
export type IResetPasswordResponse = null;
