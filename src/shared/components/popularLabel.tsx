import type { ReactNode } from "react";
import { cn } from "cn";

interface PopularLabelProps {
  children: ReactNode;
  className?: string;
}

export default function PopularLabel({
  children,
  className,
}: PopularLabelProps) {
  return (
    <span
      className={cn(
        "relative isolate inline-block w-fit",
        "leading-[1.15] font-bold",
        "text-bg-maron dark:text-pink-200",

        // Pink background highlight
        "before:absolute before:-z-10",
        "before:start-0 before:bottom-[0.04em]",
        "before:h-[0.45em] before:w-[72%]",
        "before:rounded-e-full",
        "before:bg-pink-200 dark:before:bg-zinc-600",

        // Pink underline
        "after:absolute after:start-0 after:bottom-0",
        "after:h-[0.055em] after:w-[30%]",
        "after:rounded-full",
        "after:bg-pink-500 dark:after:bg-pink-300",

        className,
      )}
    >
      <span className="relative z-10">{children}</span>
    </span>
  );
}
