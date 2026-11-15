import { Skeleton } from "@/shared/ui/skeleton";

const REVIEW_COUNT = 3;

export function ProductReviewsSkeleton() {
  return (
    <section className="pt-12.5">
      {/* Review Title */}
      <div className="mb-8 flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-32" />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr]">
        {/* Reviews List */}
        <div className="flex flex-col gap-6">
          {Array.from({ length: REVIEW_COUNT }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="bg-border-muted mx-5 w-px" />

        {/* Review Form */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </section>
  );
}
