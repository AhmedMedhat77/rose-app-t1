"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { addToast } from "@/shared/ui/toast";
import { createReviewAction } from "../lib/actions/review.action";
import type { IReviewFormValues } from "../schemas/review.schema";
import { productOverviewQueryKey } from "./use-product-overview";

type CreateReviewInput = IReviewFormValues & { productId: string };

export function useCreateReview() {
  // Translation
  const t = useTranslations("productReview");

  // Hooks
  const queryClient = useQueryClient();

  // Mutation
  const { mutate: createReview, isPending } = useMutation({
    mutationFn: async (values: CreateReviewInput) => {
      const result = await createReviewAction(values);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (_result, { productId }) => {
      void queryClient.invalidateQueries({
        queryKey: productOverviewQueryKey(productId),
      });
      addToast(TOAST_STATE.Successful, t("REVIEW_CREATED"));
    },
    onError: (error) => {
      const errorMessage = t.has(error.message)
        ? t(error.message)
        : t("SOMETHING_WENT_WRONG");

      addToast(TOAST_STATE.Unsuccessful, errorMessage);
    },
  });

  return { createReview, isPending };
}
