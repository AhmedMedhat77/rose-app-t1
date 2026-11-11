import type { z } from "zod";

import type { createChangePasswordSchema } from "../schemas/change-password.schema";

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;

/** Body of POST /users/change-password. */
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type ChangePasswordField = keyof ChangePasswordFormValues;

export type ChangePasswordActionResult =
  | { success: true; accessToken?: string }
  | { success: false; code?: number; fields: ChangePasswordField[] };

export class ChangePasswordRequestError extends Error {
  readonly code?: number;
  readonly fields: ChangePasswordField[];

  constructor(code?: number, fields: ChangePasswordField[] = []) {
    super("Request failed");
    this.name = "ChangePasswordRequestError";
    this.code = code;
    this.fields = fields;
  }
}
