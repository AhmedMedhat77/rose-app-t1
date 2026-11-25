"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { addToast } from "@/shared/ui/toast";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";

import { createReviewAction } from "../lib/actions/review.action";
import type { IReviewFormValues } from "../schemas/review.schema";

type CreateReviewInput = IReviewFormValues & { productId: string };

export function useCreateReview() {
  // Translation
  const t = useTranslations("productReview");

  // Mutation
  const { mutate: createReview, isPending } = useMutation({
    mutationFn: async (values: CreateReviewInput) => {
      const result = await createReviewAction(values);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      addToast(TOAST_STATE.Successful, t("REVIEW_CREATED"));
    },
    onError: (error) => {
      const message = t.has(error.message)
        ? t(error.message)
        : t("SOMETHING_WENT_WRONG");
      addToast(TOAST_STATE.Unsuccessful, message);
    },
  });

  return { createReview, isPending };
}
