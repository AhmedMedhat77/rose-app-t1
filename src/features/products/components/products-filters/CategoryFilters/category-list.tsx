"use client";

import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import FetchFeedback from "@/shared/components/fetch-feedback";
import { useCategories } from "@/features/products/api/mutations/use-category";
import { useFilterParam } from "@/features/products/hooks/use-filter-param";
import { useInfiniteSentinel } from "@/features/products/hooks/use-infinite-sentinel";
import { FILTER_KEYS } from "@/features/products/lib/constants/filters.const";
import CategorySkeleton from "@/features/products/skeletons/category-skeleton";

export default function CategoryList() {
  const t = useTranslations();
  //custom Query
  const {
    data: categorieslist,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useCategories();
  //Custom hooks
  const { value: selectedId, select } = useFilterParam(FILTER_KEYS.CATEGORY);
  // handell infinent scroll
  const { rootRef, sentinelRef } = useInfiniteSentinel({
    onReach: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
  });
  //is loading
  if (isPending) return <CategorySkeleton />;
  // is error message
  if (isError && !categorieslist) {
    return (
      <FetchFeedback>
        {t("productFilter.filtersError")}
        <button type="button" onClick={() => refetch()}>
          {t("productFilter.filtersRetry")}
        </button>
      </FetchFeedback>
    );
  }
  // is empty category
  if (!categorieslist || categorieslist.length === 0) {
    return <FetchFeedback>{t("productFilter.filtersEmpty")}</FetchFeedback>;
  }

  return (
    <div
      ref={rootRef}
      className="flex max-h-49.75 [scrollbar-width:none] flex-col gap-2.5 overflow-y-auto [&::-webkit-scrollbar]:hidden"
    >
      {categorieslist.map((el) => {
        const isActive = selectedId === el.title;
        return (
          <button
            key={el.id}
            type="button"
            onClick={() => select(el.title)}
            aria-pressed={isActive}
            className={`flex h-7 shrink-0 items-center gap-2.5 rounded-sm hover:bg-zinc-300 hover:dark:bg-zinc-600 ${isActive ? "bg-bg-primary-fade dark:bg-secondary-faint" : "bg-bg-soft"}`}
          >
            <div
              className={`flex h-full w-9 items-center justify-center rounded-s-sm hover:dark:bg-zinc-500 ${isActive ? "bg-maroon-600 dark:bg-bg-primary" : "bg-bg-default dark:bg-zinc-500"}`}
            >
              {el.image && (
                <Image
                  src={el.image}
                  alt=""
                  width={21}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              )}
            </div>
            <span className="text-text-plain text-sm font-medium">
              {el.title}
            </span>
          </button>
        );
      })}
      {/* sentinel: when it becomes visible inside the scroll area, the next page loads */}
      <div ref={sentinelRef} className="h-px shrink-0" aria-hidden />

      {isFetchingNextPage && (
        <LoaderCircle className="mx-auto shrink-0 animate-spin" />
      )}
      {/* next page failed: keep the list visible and show retry */}
      {isFetchNextPageError && (
        <div className="flex shrink-0 flex-col items-center gap-1 py-2 text-sm">
          <span className="text-text-plain">
            {t("productFilter.filtersError")}
          </span>
          <button
            type="button"
            onClick={() => fetchNextPage()}
            className="text-text-danger underline"
          >
            {t("productFilter.filtersRetry")}
          </button>
        </div>
      )}
    </div>
  );
}
