import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { updateProfile, uploadProfilePhoto } from "../lib/apis/profile.api";
import type { ProfileFormValues } from "../lib/schemas/profile.schema";
import { addToast } from "@/shared/ui/toast";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { profileKeys } from "./use-profile";

export function useUpdateProfile() {
  const t = useTranslations("accountSettings.Profile");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const photo = values.photo
        ? await uploadProfilePhoto(values.photo)
        : undefined;

      return updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        ...(photo && { photo }),
      });
    },
    onSuccess: (user) => {
      queryClient.setQueryData(profileKeys.detail, user);
      addToast(TOAST_STATE.Successful, t("toasts.updateSuccess"));
    },
    onError: () => {
      addToast(TOAST_STATE.Unsuccessful, t("toasts.updateError"));
    },
  });
}
