"use client";

import { useMutation } from "@tanstack/react-query";
import { confirmEmailAction } from "../actions/confirm-email.action";
import type { TConfirmEmailFormValues } from "../types";

export function useConfirmEmail() {
  return useMutation({
    mutationFn: async (values: TConfirmEmailFormValues) => {
      const result = await confirmEmailAction(values);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
  });
}
