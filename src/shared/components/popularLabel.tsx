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
        "text-text-maron-700 dark:text-text-maron",

        // Pink background highlight
        "before:absolute before:-z-10",
        "before:inset-s-0 before:bottom-[0.04em]",
        "before:h-[0.45em] before:w-[72%]",
        "before:rounded-e-full",
        "before:bg-bg-secondary-faint dark:before:bg-bg-plain",

        // Pink underline
        "after:absolute after:inset-s-0 after:bottom-0",
        "after:h-[0.055em] after:w-[30%]",
        "after:rounded-full",
        "after:bg-soft-pink-600 dark:after:bg-soft-pink-500",

        className,
      )}
    >
      <span className="relative z-10">{children}</span>
    </span>
  );
}
