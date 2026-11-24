import { Skeleton } from "@/shared/ui/skeleton";

const VISIBLE_CARD_COUNT = 4;

export function ProductsCarouselSkeleton() {
  return (
    <div className="relative w-full min-w-0" aria-busy="true">
      <div className="overflow-hidden">
        <div className="-ms-4 flex">
          {Array.from({ length: VISIBLE_CARD_COUNT }).map((_, index) => (
            <div key={index} className="min-w-0 shrink-0 grow-0 basis-80 ps-4">
              <div className="flex w-full flex-col gap-3">
                <Skeleton className="h-68 w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="size-10 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="absolute top-1/2 -left-3.75 z-20 size-9 -translate-y-1/2 rounded-full" />
      <Skeleton className="absolute top-1/2 -right-3.75 z-20 size-9 -translate-y-1/2 rounded-full" />
    </div>
  );
}
