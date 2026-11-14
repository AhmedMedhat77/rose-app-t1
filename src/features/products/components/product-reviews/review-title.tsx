import { RatingStars } from "@/shared/components/rating-stars";
import SectionsTitle from "@/shared/components/SectionsTitle";
import { useTranslations } from "next-intl";

export default function ReviewTitle() {
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
            4.5{" "}
            <span className="text-text-soft text-sm font-medium">
              (8 ratings)
            </span>
          </p>
          {/* Rating & Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <RatingStars rating={3.5} />
            </div>
          </div>
        </div>
      </div>
      <div className="border-muted my-4 border" />
    </div>
  );
}
