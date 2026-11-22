"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link } from "@/i18n/navigation";
import { RatingStars } from "@/shared/components/rating-stars";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import {
  reviewSchema,
  type IReviewFormValues,
} from "../../schemas/review.schema";
import { useTranslations } from "next-intl";
import FetchFeedback from "@/shared/components/fetch-feedback";
import { useCreateReview } from "../../hooks/use-create-review";
import { useMemo } from "react";
import { usePathname } from "@/i18n/navigation";

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
  const pathname = usePathname();
  const loginHref = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
  //schemaReview
  const reviewFormSchema = useMemo(
    () =>
      reviewSchema({
        titleRequired: t("productReview.titleRequired"),
        contentRequired: t("productReview.contentRequired"),
        ratingInteger: t("productReview.ratingInteger"),
        ratingMin: t("productReview.ratingMin"),
        ratingMax: t("productReview.ratingMax"),
      }),
    [t],
  );
  // Form
  const { control, handleSubmit, reset } = useForm<IReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      headline: "",
      content: "",
      rating: 0,
    },
  });
  //Hook
  const { createReview, isPending } = useCreateReview(productId);
  // Functions
  const onSubmit = (values: IReviewFormValues) => {
    if (!isAuthenticated) return;

    createReview(
      { ...values, productId },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };
  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        inert={!isAuthenticated}
        className={`flex flex-col gap-2.75 ${!isAuthenticated ? "blur-xs" : ""}`}
      >
        {/*rating*/}
        <Controller
          name="rating"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <span className="text-text-plain flex items-center gap-2.5 py-2.5 text-base font-medium">
                {t("productReview.yourRating")}:
                <RatingStars
                  rating={field.value}
                  size={25}
                  onRatingChange={field.onChange}
                />
              </span>
              {fieldState.error && (
                <FetchFeedback className="my-0.5 text-start">
                  {fieldState.error.message}
                </FetchFeedback>
              )}
            </>
          )}
        />
        {/*headline*/}
        <Controller
          name="headline"
          control={control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <Input
                {...field}
                className="label:text-text-plain label:text-sm label:font-medium shadow-none"
                label={t("productReview.titleLabel")}
                placeholder={t("productReview.titlePlaceholder")}
              />
              {fieldState.error && (
                <FetchFeedback className="my-0.5 text-start">
                  {fieldState.error.message}
                </FetchFeedback>
              )}
            </div>
          )}
        />
        {/*content*/}
        <Controller
          name="content"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Textarea
                {...field}
                className="label:text-text-plain label:text-sm label:font-medium resize-none"
                label={t("productReview.reviewLabel")}
                placeholder={t("productReview.reviewPlaceholder")}
              />
              {fieldState.error && (
                <FetchFeedback className="my-0.5 text-start">
                  {fieldState.error.message}
                </FetchFeedback>
              )}
            </div>
          )}
        />
        {/*add review*/}
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending
            ? t("productReview.submitting")
            : t("productReview.addReview")}
        </Button>
      </form>
      {/*blur */}
      {!isAuthenticated && (
        <Link
          href={loginHref}
          className="text-text-plain absolute inset-0 z-10 flex items-center justify-center text-center text-base font-semibold"
        >
          {t("productReview.loginToReview")}
        </Link>
      )}
    </div>
  );
}
