import Image from "next/image";
import { useOccasions } from "@/features/products/api/mutations/use-occasion";
import FetchFeedback from "@/shared/components/fetch-feedback";
import { useFilterParam } from "@/features/products/hooks/use-filter-param";
import { FILTER_KEYS } from "@/features/products/lib/constants/filters.const";
import { LoaderCircle } from "lucide-react";

export default function OccasionList() {
  const {
    data: occasions,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOccasions();

  // Custom hooks
  const { value: selectedId, select } = useFilterParam(FILTER_KEYS.OCCASION);

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
      className="grid max-h-60.5 grid-cols-2 gap-2.5 overflow-y-auto [&::-webkit-scrollbar]:hidden"
      onScroll={handleScroll}
    >
      {occasions.map((el) => {
        const isActive = selectedId === el.id;

        return (
          <button
            key={el.id}
            onClick={() => select(el.id)}
            aria-pressed={isActive}
            className="relative h-18.5 w-33.25 overflow-hidden rounded-lg"
          >
            {el.image && (
              <Image
                src={el.image}
                alt={el.title}
                fill
                className="object-cover"
              />
            )}
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                isActive
                  ? "bg-[linear-gradient(180deg,rgba(0,0,0,0.1375)_0%,rgba(166,37,42,0.55)_100%)]"
                  : "bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.8)_100%)]"
              } p-2`}
            >
              <p className="text-center text-[16px] font-medium text-[white]">
                {el.title}
              </p>
            </div>
          </button>
        );
      })}
      {isFetchingNextPage && <LoaderCircle className="mx-auto animate-spin" />}
    </div>
  );
}
