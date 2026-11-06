import { z } from "zod";
import { createForgotPasswordSchema } from "../schemas/forgot-password.schema";

export type TForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

export type TForgotPasswordPayload = TForgotPasswordFormValues & {
  // Optional. Backend appends the reset token to this URL as a query param.
  redirectUrl?: string;
};

// Endpoint returns a message-only Success response (no payload).
export type IForgotPasswordResponse = null;
