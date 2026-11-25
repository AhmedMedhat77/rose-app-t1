"use client";

import { useSession } from "next-auth/react";

import { useAddToWishlist } from "./use-add-to-wishlist";
import { useGuestWishlist } from "./use-guest-wishlist";
import { useRemoveWishlistItem } from "./use-remove-wishlist-item";
import { useWishlist } from "./use-wishlist";
import { toggleGuestWishlistItem } from "../lib/utils/guest-wishlist-storage";

export function useWishlistToggle(productId: string) {
  const { status } = useSession();
  const { isInWishlist, getItemId, isLoading } = useWishlist();
  const { isInGuestWishlist } = useGuestWishlist();
  const add = useAddToWishlist();
  const remove = useRemoveWishlistItem();

  const isGuest = status === "unauthenticated";
  const isPending = add.isPending || remove.isPending;

  const isActive = isGuest
    ? isInGuestWishlist(productId)
    : isInWishlist(productId) || add.isPending;
  const isDisabled = !isGuest && (isLoading || isPending);

  const toggle = () => {
    if (isDisabled) return;

    if (isGuest) {
      toggleGuestWishlistItem(productId);
      return;
    }

    const itemId = getItemId(productId);
    if (itemId) remove.mutate(itemId);
    else add.mutate(productId);
  };

  return { isActive, isDisabled, toggle };
}
