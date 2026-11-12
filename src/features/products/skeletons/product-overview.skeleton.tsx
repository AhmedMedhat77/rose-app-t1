export default function ProductOverviewSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl animate-pulse gap-8 px-4 py-8 lg:grid-cols-2 lg:px-6 lg:py-12">
      <div className="bg-bg-soft aspect-[1.16] rounded-2xl" />
      <div className="flex flex-col gap-5">
        <div className="bg-bg-soft h-12 rounded-lg" />
        <div className="bg-bg-soft h-10 rounded-lg" />
        <div className="bg-bg-soft h-48 rounded-lg" />
        <div className="bg-bg-soft h-14 rounded-lg" />
      </div>
    </div>
  );
}
