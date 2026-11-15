"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link } from "@/i18n/navigation";
import { RatingStars } from "@/shared/components/rating-stars";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { addToast } from "@/shared/ui/toast";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";

import {
  reviewSchema,
  type IReviewFormValues,
} from "../../schemas/review.schema";
import { createReviewAction } from "../../lib/actions/review.action";
import { useTranslations } from "next-intl";
import FetchFeedback from "@/shared/components/fetch-feedback";

interface ReviewFormProps {
  productId: string;
  isAuthenticated: boolean;
}

export default function ReviewForm({
  productId,
  isAuthenticated,
}: ReviewFormProps) {
  // Translate
  const t = useTranslations();
  // State
  const [selectedRating, setSelectedRating] = useState(0);

  // Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productId,
      headline: "",
      content: "",
      rating: 0,
    },
  });

  // Functions
  const onSubmit = async (values: IReviewFormValues) => {
    if (!isAuthenticated) return;

    const result = await createReviewAction(values);

    if (result.success) {
      addToast(TOAST_STATE.Successful, result.message);
      reset();
      setSelectedRating(0);
    } else {
      addToast(TOAST_STATE.Unsuccessful, result.message);
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col gap-2.75 ${
          !isAuthenticated ? "pointer-events-none blur-xs select-none" : ""
        }`}
      >
        <span className="text-text-plain flex items-center gap-2.5 py-2.5 text-base font-medium">
          {t("productReview.yourRating")}:
          <RatingStars
            rating={selectedRating}
            size={25}
            onRatingChange={(rating) => {
              setSelectedRating(rating);
              setValue("rating", rating, { shouldValidate: true });
            }}
          />
        </span>

        {errors.rating && (
          <FetchFeedback>{errors.rating.message}</FetchFeedback>
        )}

        <div className="flex flex-col gap-1.5">
          <Input
            {...register("headline")}
            className="label:text-text-plain label:text-sm label:font-medium shadow-none"
            label={t("productReview.titleLabel")}
            placeholder={t("productReview.titlePlaceholder")}
          />
          {errors.headline && (
            <FetchFeedback>{errors.headline.message}</FetchFeedback>
          )}
        </div>

        <div>
          <Textarea
            {...register("content")}
            className="label:text-text-plain label:text-sm label:font-medium resize-none"
            label={t("productReview.reviewLabel")}
            placeholder={t("productReview.reviewPlaceholder")}
          />
          {errors.content && (
            <FetchFeedback>{errors.content.message}</FetchFeedback>
          )}
        </div>

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting
            ? `${t("productReview.submitting")}`
            : `${t("productReview.addReview")}`}
        </Button>
      </form>

      {!isAuthenticated && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Link
            href="/login"
            className="text-text-plain text-center text-base font-semibold"
          >
            {t("productReview.loginToReview")}
          </Link>
        </div>
      )}
    </div>
  );
}
