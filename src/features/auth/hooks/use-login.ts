"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import type { TLoginFormValues } from "../types";

export function useLogin() {
  return useMutation({
    // NextAuth v4 signs in through its CSRF-protected credentials route,
    // which validates credentials server-side and sets the session cookie.
    mutationFn: async (values: TLoginFormValues) => {
      const response = await signIn("credentials", {
        ...values,
        redirect: false,
      });
      if (!response?.ok || response.error) {
        throw new Error(response?.error || "CredentialsSignin");
      }
      return response;
    },
  });
}
