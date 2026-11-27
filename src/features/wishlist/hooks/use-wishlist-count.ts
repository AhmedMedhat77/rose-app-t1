"use client";

import { useSession } from "next-auth/react";

import { useGuestWishlist } from "./use-guest-wishlist";
import { useWishlist } from "./use-wishlist";

export function useWishlistCount(): number {
  const { status } = useSession();
  const user = useWishlist();
  const guest = useGuestWishlist();

  if (status === "authenticated") return user.count;
  if (status === "unauthenticated") return guest.count;

  return 0;
}
