import { Skeleton } from "@/shared/ui/skeleton";

export function ProfileFormSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <Skeleton className="size-30 shrink-0 rounded-full" />
        <div className="flex w-full flex-col items-center gap-2 sm:items-start">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-11 w-56 rounded-xl" />
      </div>
    </div>
  );
}
