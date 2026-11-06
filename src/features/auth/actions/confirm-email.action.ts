"use server";

import { confirmEmailMutation } from "./mutations";
import { toActionError, TAuthActionResult } from "./action-result";
import { TConfirmEmailFormValues } from "../types/confirm-email.types";

export async function confirmEmailAction(
  values: TConfirmEmailFormValues,
): Promise<TAuthActionResult> {
  try {
    await confirmEmailMutation(values);
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
