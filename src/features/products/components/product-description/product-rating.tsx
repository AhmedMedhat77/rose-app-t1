import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductRatingProps {
  rating: number;
  count: number;
}

export function ProductRating({ rating, count }: ProductRatingProps) {
  const t = useTranslations("Product");

  return (
    <div className="border-border-soft flex items-center gap-2 border-b py-4">
      <Star className="fill-text-warning text-text-warning size-5" />
      <span className="text-text-black">{t("ratingValue", { rating })}</span>
      <span className="text-text-info">{t("ratingCount", { count })}</span>
    </div>
  );
}
