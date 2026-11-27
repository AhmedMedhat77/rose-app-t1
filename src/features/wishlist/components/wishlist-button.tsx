"use client";

import { cn } from "cn";
import { HeartMinus, HeartPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";

import { Button } from "@/shared/ui/button";

import { useWishlistToggle } from "../hooks/use-wishlist-toggle";

type WishlistButtonProps = {
  productId: string;
  className?: string;
  showLabel?: boolean;
};

export function WishlistButton({
  productId,
  className,
  showLabel = true,
}: WishlistButtonProps) {
  const t = useTranslations("Wishlist");
  const { isActive, isDisabled, toggle } = useWishlistToggle(productId);
  const label = isActive ? t("remove") : t("add");
  const Icon = isActive ? HeartMinus : HeartPlus;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggle();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={label}
      aria-disabled={isDisabled || undefined}
      title={showLabel ? undefined : label}
      onClick={handleClick}
      className={cn(
        "gap-0 rounded-full shadow-sm transition-all duration-200",
        showLabel
          ? "h-7.5 px-1.5 hover:pe-4 focus-visible:pe-4"
          : "size-7.5 shrink-0 p-0",
        isActive
          ? "text-text-inverse hover:text-text-inverse dark:text-secondary-foreground dark:hover:text-secondary-foreground bg-neutral-800 hover:bg-neutral-800"
          : "bg-bg-plain text-text-maroon hover:bg-bg-plain hover:text-text-maroon dark:bg-secondary-foreground dark:text-maroon-700 dark:hover:bg-secondary-foreground dark:hover:text-maroon-700",
        className,
      )}
    >
      <Icon className="size-5 shrink-0" />
      {showLabel && (
        <span
          className={cn(
            "max-w-0 overflow-hidden text-base font-medium whitespace-nowrap opacity-0 transition-all duration-200",
            "group-hover/button:ms-2 group-hover/button:max-w-56 group-hover/button:opacity-100",
            "group-focus-visible/button:ms-2 group-focus-visible/button:max-w-56 group-focus-visible/button:opacity-100",
          )}
        >
          {label}
        </span>
      )}
    </Button>
  );
}
