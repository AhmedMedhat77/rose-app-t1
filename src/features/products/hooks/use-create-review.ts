"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { addToast } from "@/shared/ui/toast";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";

import { createReviewAction } from "../lib/actions/review.action";
import type { IReviewFormValues } from "../schemas/review.schema";
import { PRODUCT_QUERY_KEYS } from "../lib/constants/product.constants";

type CreateReviewInput = IReviewFormValues & { productId: string };

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();
  //Translate
  const t = useTranslations("productReview");

  const { mutate: createReview, isPending } = useMutation({
    mutationFn: async (values: CreateReviewInput) => {
      const result = await createReviewAction(values);
      if (!result.success) throw new Error(result.message);
      return result;
    },

    onSuccess: () => {
      addToast(TOAST_STATE.Successful, t("REVIEW_CREATED"));

      queryClient.invalidateQueries({
        queryKey: PRODUCT_QUERY_KEYS.reviews(productId),
      });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_QUERY_KEYS.product(productId),
      });
    },

    onError: (error) => {
      const code = error.message;
      const message = t.has(code) ? t(code) : t("SOMETHING_WENT_WRONG");
      addToast(TOAST_STATE.Unsuccessful, message);
    },
  });

  return { createReview, isPending };
}
