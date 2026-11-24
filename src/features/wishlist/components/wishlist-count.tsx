"use client";

import { useSession } from "next-auth/react";

import { Badge } from "@/shared/ui/badge";
import { useWishlist } from "../hooks/use-wishlist";
import { useGuestWishlist } from "../hooks/use-guest-wishlist";

export default function WishlistCount() {
  const { status } = useSession();

  const { count: userWishlistCount } = useWishlist();
  const { count: guestWishlistCount } = useGuestWishlist();

  const count =
    status === "authenticated"
      ? userWishlistCount
      : status === "unauthenticated"
        ? guestWishlistCount
        : 0;

  if (count <= 0) return null;

  return (
    <Badge className="bg-bg-danger dark:bg-bg-danger text-text-inverse dark:text-secondary-foreground absolute inset-e-0 -top-1 flex size-3.5 items-center justify-center rounded-full">
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
