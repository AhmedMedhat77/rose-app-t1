import { Skeleton } from "@/shared/ui/skeleton";

const SKELETON_COUNT = 2;

function OrderCardSkeleton() {
  return (
    <div className="border-border-muted overflow-hidden rounded-lg border">
      <Skeleton className="h-13 w-full rounded-none" />
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-40" />
        <div className="grid gap-2.5 md:grid-cols-2">
          <Skeleton className="h-35 w-full" />
          <Skeleton className="h-35 w-full" />
        </div>
      </div>
    </div>
  );
}

export function OrdersListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}
