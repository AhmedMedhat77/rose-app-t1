"use client";

import { useSession } from "next-auth/react";

import { useAddToWishlist } from "./use-add-to-wishlist";
import { useRemoveWishlistItem } from "./use-remove-wishlist-item";
import { useWishlist } from "./use-wishlist";

export function useWishlistToggle(productId: string) {
  const { status } = useSession();
  const { isInWishlist, getItemId, isLoading } = useWishlist();
  const add = useAddToWishlist();
  const remove = useRemoveWishlistItem();

  const isPending = add.isPending || remove.isPending;
  const isActive = isInWishlist(productId) || add.isPending;
  const isDisabled = isLoading || isPending;

  const toggle = () => {
    // TODO: guest flow (localStorage) comes in a later step
    if (status !== "authenticated" || isDisabled) return;

    const itemId = getItemId(productId);
    if (itemId) remove.mutate(itemId);
    else add.mutate(productId);
  };

  return { isActive, isDisabled, toggle };
}
