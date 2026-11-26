import { Skeleton } from "@/shared/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="w-full space-y-2">
      {/* Product Image */}
      <Skeleton className="h-[220px] w-full rounded-xl" />

      {/* Product Title */}
      <Skeleton className="h-5 w-3/4" />

      {/* Rating & Cart */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="size-9 rounded-full" />
      </div>

      {/* Price */}
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
