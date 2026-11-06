import { Star, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function RatingFilter() {
  const t = useTranslations();
  return (
    <div className="border-border-subtle border-b">
      {/*heading*/}
      <div className="flex justify-between py-2.5">
        <h3 className="text-text-plain text-lg leading-none font-semibold tracking-normal">
          {t("productFilter.filtersRating")}
        </h3>
        <button
          type="button"
          className="text-text-danger flex items-center gap-1 text-sm"
        >
          <X className="h-3.75 w-3.75" />
          {t("productFilter.filtersReset")}
        </button>
      </div>
      {/*Rating Stars*/}
      <div className="flex gap-2 pb-4">
        <Star size={25} color="gold" />
        <Star size={25} color="gold" />
        <Star size={25} color="gold" />
        <Star size={25} color="gold" />
        <Star size={25} color="gold" />
      </div>
    </div>
  );
}
