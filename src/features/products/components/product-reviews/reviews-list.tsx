"use client";
import { RatingStars } from "@/shared/components/rating-stars";
import { useLocale, useTranslations } from "next-intl";
import { IProductReview } from "../../types/product";

interface ReviewsListProps {
  reviews: IProductReview[];
}
export default function ReviewsList({ reviews }: ReviewsListProps) {
  // Translate
  const t = useTranslations();
  const locale = useLocale();

  // Empty
  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-text-soft text-base font-medium">
          {t("productReview.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex max-h-91.75 flex-col gap-2.5 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {reviews?.map((review) => {
        const fullName =
          `${review.user.firstName} ${review.user.lastName}`.trim();

        const initials = fullName.charAt(0).toUpperCase();

        return (
          <div key={review.id} className="border-border-subtle border-b">
            {/* Name && Date */}
            <div className="flex gap-2.5">
              <div className="bg-bg-maroon-secondary flex h-11.25 w-11.25 items-center justify-center rounded-full text-xl font-semibold text-white">
                {initials}
              </div>

              <div className="flex flex-col">
                <h4 className="text-text-plain text-base font-semibold">
                  {fullName || review.user.username}
                </h4>

                <span className="text-sm font-medium text-zinc-400">
                  {new Date(review.createdAt).toLocaleDateString(locale, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center py-2.5">
              <RatingStars rating={review.rating} />

              <span className="text-text-plain ms-1 text-base font-semibold">
                ({review.rating})
              </span>
            </div>

            {/* Title && Description */}
            <div>
              <h4 className="align-middle text-base font-semibold">
                {review.headline}
              </h4>

              <p className="text-text-default pb-4 align-middle text-base leading-[125%] tracking-normal">
                {review.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
