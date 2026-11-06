"use client";

import { Star, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFilterParam } from "../../hooks/use-filter-param";
import { FILTER_KEYS } from "../../lib/constants/filters.const";

const STARS = [1, 2, 3, 4, 5];

export default function RatingFilter() {
  const t = useTranslations();
  const { value, select, reset } = useFilterParam(FILTER_KEYS.rating);

  const rating = Number(value) || 0;
  //function handleselect
  const handleSelect = (next: number) => {
    if (next === rating) reset();
    else select(String(next));
  };

  return (
    <div className="border-border-subtle border-b">
      <div className="flex justify-between py-2.5">
        <h3 className="text-text-plain text-lg leading-none font-semibold tracking-normal">
          {t("productFilter.filtersRating")}
        </h3>

        {rating > 0 && (
          <button
            type="button"
            onClick={reset}
            className="text-text-danger flex items-center gap-1 text-sm"
          >
            <X className="h-3.75 w-3.75" />
            {t("productFilter.filtersReset")}
          </button>
        )}
      </div>

      <div className="flex gap-2 pb-4">
        {STARS.map((star) => {
          const fill =
            rating >= star ? "full" : rating >= star - 0.5 ? "half" : "empty";

          return (
            <div key={star} className="relative h-6.25 w-6.25">
              <Star size={25} color="gold" />

              <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                style={{
                  width:
                    fill === "full" ? "100%" : fill === "half" ? "50%" : "0%",
                }}
              >
                <Star size={25} fill="gold" color="gold" />
              </div>

              <button
                type="button"
                aria-label={`${star - 0.5}`}
                onClick={() => handleSelect(star - 0.5)}
                className="absolute inset-y-0 start-0 w-1/2 cursor-pointer"
              />
              <button
                type="button"
                aria-label={`${star}`}
                onClick={() => handleSelect(star)}
                className="absolute inset-y-0 end-0 w-1/2 cursor-pointer"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
