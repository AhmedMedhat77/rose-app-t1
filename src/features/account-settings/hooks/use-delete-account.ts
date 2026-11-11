"use client";

import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { addToast } from "@/shared/ui/toast";

import { deleteAccountAction } from "../lib/actions/profile.action";
import { ProfileActionError } from "../lib/types/profile.types";

export function useDeleteAccount() {
  // Translation
  const t = useTranslations("accountSettings.Profile");

  // Navigation
  const router = useRouter();

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const result = await deleteAccountAction();
      if (!result.success) {
        throw new ProfileActionError(result.message, result.code);
      }
    },
    onSuccess: async () => {
      await signOut({ redirect: false });
      router.replace("/");
    },
    onError: (error) => {
      const message =
        error instanceof ProfileActionError && error.code === 403
          ? t("toasts.deleteForbidden")
          : t("toasts.deleteError");
      addToast(TOAST_STATE.Unsuccessful, message);
    },
  });

  return { isPending, deleteAccount: mutate };
}
