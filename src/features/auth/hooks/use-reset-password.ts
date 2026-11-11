"use client";

import { useMutation } from "@tanstack/react-query";
import { resetPasswordAction } from "../actions/reset-password.action";
import type { TResetPasswordPayload } from "../types";

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ token, ...values }: TResetPasswordPayload) => {
      const result = await resetPasswordAction(token, values);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
  });
}
