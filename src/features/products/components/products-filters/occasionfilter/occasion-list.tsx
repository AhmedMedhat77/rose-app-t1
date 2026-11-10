"use client";

import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import FetchFeedback from "@/shared/components/fetch-feedback";
import { useFilterParam } from "@/features/products/hooks/use-filter-param";
import { useInfiniteSentinel } from "@/features/products/hooks/use-infinite-sentinel";
import { FILTER_KEYS } from "@/features/products/lib/constants/filters.constant";
import { OccasionSkeleton } from "@/features/products/skeletons/occasion.skelaton";
import { useOccasions } from "@/features/products/hooks/use-occasion";

export default function OccasionList() {
  // Translation
  const t = useTranslations();
  // Query
  const {
    data: occasions,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useOccasions();
  // Hooks
  const { value: selectedTitle, select } = useFilterParam(FILTER_KEYS.OCCASION);

  // Hook handell infinent scroll
  const { rootRef, sentinelRef } = useInfiniteSentinel({
    onReach: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
  });
  //is loading
  if (isPending) return <OccasionSkeleton />;

  // is error message
  if (isError && !occasions) {
    return (
      <FetchFeedback>
        {t("productFilter.filtersError")}
        <button type="button" onClick={() => refetch()}>
          {t("productFilter.filtersRetry")}
        </button>
      </FetchFeedback>
    );
  }
  // is empty occauios
  if (!occasions || occasions.length === 0) {
    return <FetchFeedback>{t("productFilter.filtersEmpty")}</FetchFeedback>;
  }

  return (
    <div
      ref={rootRef}
      className="grid max-h-60.5 [scrollbar-width:none] grid-cols-2 gap-2.5 overflow-y-auto [&::-webkit-scrollbar]:hidden"
    >
      {occasions.map((el) => {
        const isActive = selectedTitle === el.title;

        return (
          <button
            key={el.id}
            type="button"
            onClick={() => select(el.title)}
            aria-pressed={isActive}
            className="relative h-18.5 w-33.25 overflow-hidden rounded-lg"
          >
            {el.image && (
              <Image
                src={el.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                loading="eager"
                className="object-cover"
              />
            )}
            <div
              className={`absolute inset-0 flex items-center justify-center p-2 hover:bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.5)_100%)] ${
                isActive
                  ? "bg-[linear-gradient(180deg,rgba(0,0,0,0.1375)_0%,rgba(166,37,42,0.55)_100%)]"
                  : "bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.8)_100%)]"
              }`}
            >
              <p className="text-center text-base font-medium text-white">
                {el.title}
              </p>
            </div>
          </button>
        );
      })}

      {/* sentinel: when it becomes visible inside the scroll area, the next page loads */}
      <div ref={sentinelRef} className="col-span-2 h-px" aria-hidden />

      {isFetchingNextPage && (
        <LoaderCircle className="col-span-2 mx-auto animate-spin" />
      )}

      {/* next page failed: keep the list visible and show retry */}
      {isFetchNextPageError && (
        <div className="col-span-2 flex flex-col items-center gap-1 py-2 text-sm">
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
