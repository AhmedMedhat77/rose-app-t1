"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { addToast } from "@/shared/ui/toast";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { changePassword } from "../lib/apis/change-password.api";
import type { ChangePasswordFormValues } from "../lib/schemas/change-password.schema";
import {
  ChangePasswordRequestError,
  toChangePasswordPayload,
} from "../lib/types/change-password.types";

export function useChangePassword() {
  const t = useTranslations("accountSettings");
  const { data: session, update } = useSession();

  return useMutation({
    mutationFn: async (values: ChangePasswordFormValues) => {
      const accessToken =
        session?.accessToken ?? process.env.NEXT_PUBLIC_DEV_TOKEN;

      if (!accessToken) {
        throw new ChangePasswordRequestError("generic");
      }

      await changePassword(toChangePasswordPayload(values), accessToken);
      // Re-read the NextAuth session so the app does not keep stale session data.
      // The password change does not sign the user out.
      await update();
    },
    onSuccess: () => {
      addToast(TOAST_STATE.Successful, t("toasts.passwordUpdatedSuccess"));
    },
    onError: (error) => {
      if (
        error instanceof ChangePasswordRequestError &&
        error.reason !== "generic"
      ) {
        return;
      }

      addToast(TOAST_STATE.Unsuccessful, t("toasts.passwordUpdatedError"));
    },
  });
}
