"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { addToast } from "@/shared/ui/toast";

import { updateProfileAction } from "../lib/actions/profile.action";
import type { ProfileFormValues } from "../lib/types/profile.types";
import { ProfileActionError } from "../lib/types/profile.types";

export function useUpdateProfile() {
  // Translation
  const t = useTranslations("accountSettings.Profile");

  // Navigation
  const router = useRouter();

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const result = await updateProfileAction(values);
      if (!result.success) {
        throw new ProfileActionError(result.message, result.code);
      }

      return result.user;
    },
    onSuccess: () => {
      addToast(TOAST_STATE.Successful, t("toasts.updateSuccess"));
      router.refresh();
    },
    onError: () => {
      addToast(TOAST_STATE.Unsuccessful, t("toasts.updateError"));
    },
  });

  return { isPending, updateProfile: mutate };
}
