import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { addToast } from "@/shared/ui/toast";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { ApiError, deleteAccount } from "../lib/apis/profile.api";

export function useDeleteAccount() {
  const t = useTranslations("Profile");
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      // ASSUMPTION: session is cookie-based and dies with the account. If tokens are kept
      // client-side, call the project's existing logout/clear-session helper here too.
      queryClient.clear();
      router.replace("/");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof ApiError && error.status === 403
          ? t("toasts.deleteForbidden")
          : t("toasts.deleteError");
      addToast(TOAST_STATE.Unsuccessful, errorMessage);
    },
  });
}
