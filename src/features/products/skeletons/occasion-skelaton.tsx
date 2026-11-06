// features/products/components/products-filters/occasion-skeleton.tsx
import { Skeleton } from "@/shared/ui/skeleton";

const SKELETON_TILES = 6;

export function OccasionSkeleton() {
  return (
    <div className="grid max-h-60.5 grid-cols-2 gap-2.5 overflow-hidden">
      {/* Index as key is acceptable — static placeholders */}
      {Array.from({ length: SKELETON_TILES }).map((_, index) => (
        <Skeleton key={index} className="h-18.5 w-33.25 rounded-lg" />
      ))}
    </div>
  );
}
