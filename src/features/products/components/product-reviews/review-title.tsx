import { RatingStars } from "@/shared/components/rating-stars";
import SectionsTitle from "@/shared/components/SectionsTitle";
import { useTranslations } from "next-intl";
interface ReviewTitleProps {
  averageRating: number;
  totalRatings: number;
}
export default function ReviewTitle({
  averageRating,
  totalRatings,
}: ReviewTitleProps) {
  // Translate
  const t = useTranslations();
  return (
    <div>
      <div className="flex flex-col items-start gap-2.5">
        {/*Title*/}
        <SectionsTitle mainTitle={`${t("productReview.title")}`} />
        {/*general rating */}
        <div className="flex flex-col gap-1">
          <h4 className="text-text-plain text-xl font-semibold">
            {`${t("productReview.generalRating")}`}:
          </h4>
          <p className="text-text-plain text-2xl font-bold">
            {averageRating.toFixed(1)}{" "}
            <span className="text-text-soft text-sm font-medium">
              ({totalRatings} {t("productReview.ratings")})
            </span>
          </p>
          {/* Rating & Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <RatingStars rating={averageRating} />
            </div>
          </div>
        </div>
      </div>
      <div className="border-border-muted dark:border-border-subtle my-4 border" />
    </div>
  );
}
