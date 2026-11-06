"use client";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useCategories } from "@/features/products/api/mutations/use-category";
import FetchFeedback from "@/shared/components/fetch-feedback";
import { useFilterParam } from "@/features/products/hooks/use-filter-param";
import { FILTER_KEYS } from "@/features/products/lib/constants/filters.const";

export default function CategoryList() {
  // Queries
  const {
    data: categorieslist,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCategories();

  // Custom hooks
  const { value: selectedId, select } = useFilterParam(FILTER_KEYS.CATEGORY);

  if (isError) {
    return (
      <FetchFeedback>{error?.message || "Something went wrong"}</FetchFeedback>
    );
  }

  //function handelScroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <div
      className="flex max-h-49.75 flex-col gap-2.5 overflow-y-auto [&::-webkit-scrollbar]:hidden"
      onScroll={handleScroll}
    >
      {categorieslist?.map((el) => {
        const isActive = selectedId === el.id;
        return (
          <button
            key={el.id}
            onClick={() => select(el.id)}
            aria-pressed={isActive}
            className={`flex h-7 shrink-0 items-center gap-2.5 rounded-sm hover:bg-zinc-300 hover:dark:bg-zinc-600 ${isActive ? "bg-bg-primary-fade dark:bg-secondary-faint" : "bg-bg-soft"}`}
          >
            <div
              className={`flex h-full w-9 items-center justify-center rounded-s-sm hover:dark:bg-zinc-500 ${isActive ? "bg-maroon-600 dark:bg-bg-primary" : "bg-bg-default dark:bg-zinc-500"}`}
            >
              {el.image && (
                <Image
                  src={el.image}
                  alt={el.title}
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

      {isFetchingNextPage && <LoaderCircle className="mx-auto animate-spin" />}
    </div>
  );
}
