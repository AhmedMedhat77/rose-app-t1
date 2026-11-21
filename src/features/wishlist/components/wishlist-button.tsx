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
};

export function WishlistButton({ productId, className }: WishlistButtonProps) {
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
      onClick={handleClick}
      className={cn(
        // Collapsed: a 40px circle
        "h-10 gap-0 rounded-full px-2.5 shadow-sm transition-all duration-200",
        // Expanded: extra space at the end so the text isn't cramped
        "hover:pe-4 focus-visible:pe-4",
        isActive
          ? "bg-neutral-800 text-white hover:bg-neutral-800 hover:text-white"
          : "bg-white text-[#A8232B] hover:bg-white hover:text-[#A8232B]",
        className,
      )}
    >
      <Icon className="size-6 shrink-0" strokeWidth={2.25} />
      <span
        className={cn(
          "max-w-0 overflow-hidden text-base font-medium whitespace-nowrap opacity-0 transition-all duration-200",
          "group-hover/button:ms-2 group-hover/button:max-w-56 group-hover/button:opacity-100",
          "group-focus-visible/button:ms-2 group-focus-visible/button:max-w-56 group-focus-visible/button:opacity-100",
        )}
      >
        {label}
      </span>
    </Button>
  );
}
