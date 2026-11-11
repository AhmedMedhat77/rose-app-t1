// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { sendEmailVerificationAction } from "../actions/send-email-verification.action";
// import type { TSendEmailVerificationValues } from "../types/register.types";

// export function useSendEmailVerification() {
//   return useMutation({
//     mutationFn: async (values: TSendEmailVerificationValues) => {
//       const result = await sendEmailVerificationAction(values);
//       if (!result.success) {
//         throw new Error(result.message);
//       }
//       return result;
//     },
//   });
// }

// use-send-email-verification.ts
"use client";

import { useMutation } from "@tanstack/react-query";

import { sendEmailVerificationAction } from "@/features/auth/actions/send-email-verification.action";
import type { TSendEmailVerificationValues } from "@/features/auth/types";

import { markOtpSent } from "../lib/otp-cooldown";

export function useSendEmailVerification() {
  return useMutation({
    mutationFn: async (values: TSendEmailVerificationValues) => {
      const result = await sendEmailVerificationAction(values);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (_result, values) => markOtpSent(values.email),
  });
}
