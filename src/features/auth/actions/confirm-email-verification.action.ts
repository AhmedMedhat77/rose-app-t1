"use server";

import { confirmEmailVerificationMutation } from "./mutations";
import { toActionError, TAuthActionResult } from "./action-result";
import { TConfirmEmailVerificationValues } from "../types/register.types";

export async function confirmEmailVerificationAction(
  values: TConfirmEmailVerificationValues,
): Promise<TAuthActionResult> {
  try {
    await confirmEmailVerificationMutation(values);
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
