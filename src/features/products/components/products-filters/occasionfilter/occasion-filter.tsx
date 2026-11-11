"use client";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import OccasionList from "./occasion-list";
import { useFilterParam } from "@/features/products/hooks/use-filter-param";
import { FILTER_KEYS } from "@/features/products/lib/constants/filters.constant";

export default function OccasionFilter() {
  // Translation
  const t = useTranslations();
  // Hooks
  const { value: selectedTitle, reset } = useFilterParam(FILTER_KEYS.OCCASION);

  return (
    <div className="border-border-subtle h-75 border-b">
      {/*heading*/}
      <div className="flex justify-between py-2.5">
        <h3 className="text-text-plain text-lg leading-none font-semibold tracking-normal">
          {t("productFilter.filtersOccasion")}
        </h3>
        {selectedTitle && (
          <button
            onClick={reset}
            type="button"
            className="text-text-danger flex items-center gap-1 text-sm"
            aria-label={t("productFilter.filtersReset")}
          >
            <X className="h-3.75 w-3.75" aria-hidden />
            {t("productFilter.filtersReset")}
          </button>
        )}
      </div>

      {/*Occasion List */}
      <OccasionList />
    </div>
  );
}
