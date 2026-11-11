"use client";

import { useMutation } from "@tanstack/react-query";

import { registerAction } from "@/features/auth/actions/register.action";
import type { TRegisterFormValues } from "@/features/auth/types";

export function useRegister() {
  return useMutation({
    mutationFn: async (values: TRegisterFormValues) => {
      const result = await registerAction(values);
      if (!result.success) throw new Error(result.message);
      return result;
    },
  });
}
