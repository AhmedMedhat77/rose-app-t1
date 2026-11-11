"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { addToast } from "@/shared/ui/toast";

import { changePasswordAction } from "../lib/actions/change-password.action";
import {
  ChangePasswordRequestError,
  type ChangePasswordFormValues,
} from "../lib/types/change-password.types";

export function useChangePassword() {
  // Translation
  const t = useTranslations("accountSettings");

  // Hooks
  const { update } = useSession();

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: async (values: ChangePasswordFormValues) => {
      const result = await changePasswordAction(values);
      if (!result.success) {
        throw new ChangePasswordRequestError(result.code, result.fields);
      }

      return result.accessToken;
    },
    onSuccess: async (accessToken) => {
      await update(accessToken ? { accessToken } : undefined);
      addToast(TOAST_STATE.Successful, t("toasts.passwordUpdatedSuccess"));
    },
    onError: (error) => {
      if (
        error instanceof ChangePasswordRequestError &&
        error.fields.length > 0
      ) {
        return;
      }

      addToast(TOAST_STATE.Unsuccessful, t("toasts.passwordUpdatedError"));
    },
  });

  return { isPending, changePassword: mutate };
}
