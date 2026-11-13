export default function CategorySkeleton() {
  return (
    <div className="flex max-h-49.75 flex-col gap-2.5 overflow-hidden">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="bg-bg-soft flex h-7 shrink-0 animate-pulse items-center gap-2.5 rounded-sm"
        >
          <div className="bg-bg-default h-full w-9 rounded-s-sm" />
          <div className="bg-bg-default h-3 w-24 rounded-sm" />
        </div>
      ))}
    </div>
  );
}
