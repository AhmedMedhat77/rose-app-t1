"use client";

import { useMutation } from "@tanstack/react-query";
import { forgotPasswordAction } from "../actions/forgot-password.action";
import type { TForgotPasswordPayload } from "../types";

export function useForgotPassword() {
  return useMutation({
    mutationFn: async ({ redirectUrl, ...values }: TForgotPasswordPayload) => {
      const result = await forgotPasswordAction(values, redirectUrl);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
  });
}
