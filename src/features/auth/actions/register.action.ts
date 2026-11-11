"use server";

import { registerMutation } from "./mutations";
import { toActionError, TAuthActionResult } from "./action-result";
import { TRegisterFormValues } from "../types/register.types";

export async function registerAction(
  values: TRegisterFormValues,
): Promise<TAuthActionResult> {
  try {
    await registerMutation(values);
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
