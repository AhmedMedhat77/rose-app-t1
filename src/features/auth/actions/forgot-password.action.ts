"use server";

import { forgotPasswordMutation } from "./mutations";
import { toActionError, TAuthActionResult } from "./action-result";
import { TForgotPasswordFormValues } from "../types/forgot-password.types";

export async function forgotPasswordAction(
  values: TForgotPasswordFormValues,
  redirectUrl?: string,
): Promise<TAuthActionResult> {
  try {
    await forgotPasswordMutation({ ...values, redirectUrl });
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
