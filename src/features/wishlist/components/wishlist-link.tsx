"use client";

import { cn } from "cn";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { useWishlistCount } from "../hooks/use-wishlist-count";
import { Badge } from "@/shared/ui/badge";

const MAX_BADGE_COUNT = 99;

type WishlistLinkProps = {
  className?: string;
};

export function WishlistLink({ className }: WishlistLinkProps) {
  const t = useTranslations("Wishlist");
  const count = useWishlistCount();

  const label =
    count > 0 ? `${t("title")} (${t("count", { count })})` : t("title");

  return (
    <Link
      href="/wishlist"
      aria-label={label}
      className={cn("relative", className)}
    >
      <Heart aria-hidden="true" />

      {count > 0 && (
        <Badge className="bg-bg-danger dark:bg-bg-danger text-text-inverse dark:text-secondary-foreground absolute inset-e-0 -top-1 flex size-3.5 items-center justify-center rounded-full">
          {count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : count}
        </Badge>
      )}
    </Link>
  );
}
