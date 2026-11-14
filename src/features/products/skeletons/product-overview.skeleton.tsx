import { ProductsCarouselSkeleton } from "@/shared/skeletons/products-carousel.skeleton";
import { Skeleton } from "@/shared/ui/skeleton";

const THUMBNAIL_COUNT = 4;

export function ProductOverviewSkeleton() {
  return (
    <div
      className="container mx-auto flex flex-col gap-12 px-4 py-8 lg:py-12"
      aria-busy="true"
    >
      <section className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-17.5">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-[1.16] w-full rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: THUMBNAIL_COUNT }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-5 w-28" />
          <div className="mt-auto flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-lg" />
            <Skeleton className="size-12 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Related products */}
      <section className="flex flex-col gap-6">
        <Skeleton className="h-8 w-56" />
        <ProductsCarouselSkeleton />
      </section>
    </div>
  );
}
