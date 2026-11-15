"use client";

import { cn } from "cn";
import { Heart } from "lucide-react";
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

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // the card is usually wrapped in a link
    event.preventDefault();
    event.stopPropagation();
    toggle();
  };

  return (
    <Button
      type="button"
      variant={isActive ? "primary" : "ghost"}
      size="sm"
      aria-label={label}
      aria-disabled={isDisabled || undefined}
      onClick={handleClick}
      className={cn(
        "gap-0 rounded-full px-2.5 shadow-sm",
        !isActive && "text-text-primary",
        className,
      )}
    >
      <Heart className={cn(isActive && "fill-current")} />
      <span
        className={cn(
          "max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200",
          "group-hover/button:ms-2 group-hover/button:max-w-48 group-hover/button:opacity-100",
          "group-focus-visible/button:ms-2 group-focus-visible/button:max-w-48 group-focus-visible/button:opacity-100",
        )}
      >
        {label}
      </span>
    </Button>
  );
}
