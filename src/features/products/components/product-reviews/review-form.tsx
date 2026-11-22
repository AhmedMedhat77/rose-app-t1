"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { Link, usePathname } from "@/i18n/navigation";
import { RatingStars } from "@/shared/components/rating-stars";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

import { useCreateReview } from "../../hooks/use-create-review";
import { IReviewFormValues, reviewSchema } from "../../schemas/review.schema";
interface ReviewFormProps {
  productId: string;
  isAuthenticated: boolean;
}

export default function ReviewForm({
  productId,
  isAuthenticated,
}: ReviewFormProps) {
  // Translation
  const t = useTranslations("productReview");

  // Navigation
  const pathname = usePathname();

  // Hooks
  const { createReview, isPending } = useCreateReview();

  // Form
  const form = useForm<IReviewFormValues>({
    resolver: zodResolver(
      reviewSchema({
        titleRequired: t("titleRequired"),
        contentRequired: t("contentRequired"),
        ratingInteger: t("ratingInteger"),
        ratingMin: t("ratingMin"),
        ratingMax: t("ratingMax"),
      }),
    ),
    defaultValues: { headline: "", content: "", rating: 0 },
  });

  // Variables
  const loginHref = `/login?callbackUrl=${encodeURIComponent(pathname)}`;

  // Functions
  function onSubmit(values: IReviewFormValues) {
    if (!isAuthenticated) return;

    createReview({ ...values, productId }, { onSuccess: () => form.reset() });
  }

  return (
    <div className="relative">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        inert={!isAuthenticated}
        className={!isAuthenticated ? "blur-xs" : undefined}
      >
        <FieldGroup>
          {/* Rating */}
          <Controller
            name="rating"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center gap-2.5 py-2.5">
                  {/* Label */}
                  <FieldLabel>{t("yourRating")}:</FieldLabel>

                  {/* Field */}
                  <RatingStars
                    rating={field.value}
                    size={25}
                    onRatingChange={field.onChange}
                  />
                </div>

                {/* Feedback */}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Headline */}
          <Controller
            name="headline"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {/* Label */}
                <FieldLabel htmlFor={field.name}>{t("titleLabel")}</FieldLabel>

                {/* Field */}
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder={t("titlePlaceholder")}
                />

                {/* Feedback */}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Content */}
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {/* Label */}
                <FieldLabel htmlFor={field.name}>{t("reviewLabel")}</FieldLabel>

                {/* Field */}
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder={t("reviewPlaceholder")}
                  className="resize-none"
                />

                {/* Feedback */}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? t("submitting") : t("addReview")}
          </Button>
        </FieldGroup>
      </form>

      {/* Login overlay */}
      {!isAuthenticated && (
        <Link
          href={loginHref}
          className="text-text-plain absolute inset-0 z-10 flex items-center justify-center text-center text-base font-semibold"
        >
          {t("loginToReview")}
        </Link>
      )}
    </div>
  );
}
