"use server";

import { sendEmailVerificationMutation } from "./mutations";
import { toActionError, TAuthActionResult } from "./action-result";
import { TSendEmailVerificationValues } from "../types/register.types";

export async function sendEmailVerificationAction(
  values: TSendEmailVerificationValues,
): Promise<TAuthActionResult> {
  try {
    await sendEmailVerificationMutation(values);
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
