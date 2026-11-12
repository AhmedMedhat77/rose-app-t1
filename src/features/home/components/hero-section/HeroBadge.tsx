export function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-bg-danger-fade dark:bg-maroon-50 w-fit rounded-full px-2 py-0.5 text-[10px] font-medium text-red-700">
      {children}
    </span>
  );
}
