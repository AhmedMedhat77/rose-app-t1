export function ReviewItemSkeleton() {
  return (
    <div className="border-border-subtle animate-pulse border-b pb-4">
      <div className="flex gap-2.5">
        <div className="h-11.25 w-11.25 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="flex flex-col justify-center gap-2">
          <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
      <div className="my-3 h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mb-2 h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mt-2 h-3 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
    </div>
  );
}

export default function ReviewsListSkeleton() {
  return (
    <div className="flex max-h-91.75 flex-col gap-2.5 overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <ReviewItemSkeleton key={i} />
      ))}
    </div>
  );
}
