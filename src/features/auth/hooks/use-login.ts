"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

import { getSafeCallbackUrl } from "@/shared/lib/utils/safe-callback-url.util";
import type { TLoginFormValues } from "../types";

export function useLogin() {
  return useMutation({
    mutationFn: async (values: TLoginFormValues) => {
      const searchParams = new URLSearchParams(window.location.search);

      const currentPath = window.location.pathname + window.location.search;

      const pathnameWithoutLocale =
        window.location.pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
      const localePrefix =
        window.location.pathname.match(/^\/(en|ar)(?=\/|$)/)?.[0] ?? "";
      const localeHome = localePrefix ? `${localePrefix}/` : "/";

      const isAuthPage = /^\/(login|register|forgot-password)(\/|$)/.test(
        pathnameWithoutLocale,
      );

      const callbackUrl =
        getSafeCallbackUrl(searchParams.get("callbackUrl")) ??
        (isAuthPage ? localeHome : getSafeCallbackUrl(currentPath)) ??
        localeHome;

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
