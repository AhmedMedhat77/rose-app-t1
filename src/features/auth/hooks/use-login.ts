"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

import { getSafeCallbackUrl } from "@/shared/lib/utils/safe-callback-url.util";
import type { TLoginFormValues } from "../types";

export function useLogin() {
  return useMutation({
    mutationFn: async (values: TLoginFormValues) => {
      const searchParams = new URLSearchParams(window.location.search);

      const callbackUrl =
        getSafeCallbackUrl(searchParams.get("callbackUrl")) ??
        getSafeCallbackUrl(window.location.pathname + window.location.search) ??
        "/";

      const response = await signIn("credentials", {
        ...values,
        redirect: false,
        callbackUrl,
      });

      if (!response?.ok || response.error) {
        throw new Error(response?.error || "CredentialsSignin");
      }

      return response;
    },
  });
}
