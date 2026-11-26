"use client";
import { useMergeGuestWishlist } from "../hooks/use-merge-guest-wishlist";

export function GuestWishlistMerger() {
  useMergeGuestWishlist();
  return null;
}
