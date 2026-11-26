import { cn } from "@/shared/lib/utils/cn.util";
import { Skeleton } from "@/shared/ui/skeleton";

interface SummaryAmountSkeletonProps {
  className?: string;
}

export function SummaryAmountSkeleton({
  className,
}: SummaryAmountSkeletonProps) {
  return <Skeleton className={cn("h-6 w-24", className)} />;
}
