"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

import { changePassword } from "../apis/change-password.api";
import { createChangePasswordSchema } from "../schemas/change-password.schema";
import {
  ChangePasswordRequestError,
  type ChangePasswordActionResult,
  type ChangePasswordFormValues,
} from "../types/change-password.types";
import { toChangePasswordPayload } from "../utils/change-password.util";

const changePasswordActionSchema = createChangePasswordSchema({
  required: "Required",
  passwordMinLength: "Invalid password",
  passwordUppercase: "Invalid password",
  passwordLowercase: "Invalid password",
  passwordNumber: "Invalid password",
  passwordSpecial: "Invalid password",
  passwordSameAsOld: "Invalid password",
  passwordsDoNotMatch: "Invalid password",
});

export async function changePasswordAction(
  values: ChangePasswordFormValues,
): Promise<ChangePasswordActionResult> {
  const parsed = changePasswordActionSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, fields: [] };
  }

  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return { success: false, code: 401, fields: [] };
  }

  try {
    const nextAccessToken = await changePassword(
      accessToken,
      toChangePasswordPayload(parsed.data),
    );
    return {
      success: true,
      ...(nextAccessToken ? { accessToken: nextAccessToken } : {}),
    };
  } catch (error) {
    if (error instanceof ChangePasswordRequestError) {
      return {
        success: false,
        code: error.code,
        fields: error.fields,
      };
    }

    return { success: false, fields: [] };
  }
}
