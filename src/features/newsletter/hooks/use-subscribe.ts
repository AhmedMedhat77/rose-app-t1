"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { addToast } from "@/shared/ui/toast";
import { subscribeAction } from "../lib/actions/newsletter.action";

export function useSubscribe() {
  const t = useTranslations("Footer");

  const { isPending, mutate } = useMutation({
    mutationFn: (email: string) => subscribeAction(email),
    onSuccess: (result) => {
      if (result === "subscribed") {
        addToast(TOAST_STATE.Successful, t("subscribeSuccess"));
      } else if (result === "already-subscribed") {
        addToast(TOAST_STATE.Unsuccessful, t("subscribeAlready"));
      } else {
        addToast(TOAST_STATE.Unsuccessful, t("subscribeError"));
      }
    },
    onError: () => addToast(TOAST_STATE.Unsuccessful, t("subscribeError")),
  });

  return { isPending, subscribe: mutate };
}
