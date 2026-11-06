export function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-fit rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
      {children}
    </span>
  );
}
