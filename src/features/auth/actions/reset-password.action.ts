"use server";

import { resetPasswordMutation } from "./mutations";
import { toActionError, TAuthActionResult } from "./action-result";
import { TResetPasswordFormValues } from "../types/reset-password.types";

export async function resetPasswordAction(
  token: string,
  values: TResetPasswordFormValues,
): Promise<TAuthActionResult> {
  try {
    await resetPasswordMutation({ ...values, token });
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
