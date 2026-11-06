"use client";
import { X } from "lucide-react";
import CategoryList from "./category-list";
import { useTranslations } from "next-intl";
import CategorySkeleton from "../../../skeletons/category-skeleton";
import { FILTER_KEYS } from "@/features/products/lib/constants/filters.const";
import { useFilterParam } from "@/features/products/hooks/use-filter-param";
import { FilterBoundary } from "../../filter-boundary";

export default function CategoryFilter() {
  const t = useTranslations();

  const { value: selectedId, reset } = useFilterParam(FILTER_KEYS.CATEGORY);
  return (
    <div className="border-border-subtle h-64.25 border-b">
      {/* Heading */}
      <div className="flex justify-between py-2.5">
        <h3 className="text-text-plain text-lg leading-none font-semibold tracking-normal">
          {t("productFilter.filterCategory")}
        </h3>
        {selectedId && (
          <button
            onClick={reset}
            type="button"
            aria-label={t("productFilter.filtersReset")}
            className="text-text-danger flex items-center gap-1 text-sm"
          >
            <X className="h-3.75 w-3.75" aria-hidden />
            {t("productFilter.filtersReset")}
          </button>
        )}
      </div>

      {/* Category List */}
      <FilterBoundary skeleton={<CategorySkeleton />}>
        <CategoryList />
      </FilterBoundary>
    </div>
  );
}
