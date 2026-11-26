"use client";

import { useSyncExternalStore } from "react";
import {
  getGuestWishlistServerSnapshot,
  getGuestWishlistSnapshot,
  subscribeToGuestWishlist,
} from "../lib/utils/guest-wishlist-storage";

export function useGuestWishlist() {
  const ids = useSyncExternalStore(
    subscribeToGuestWishlist,
    getGuestWishlistSnapshot,
    getGuestWishlistServerSnapshot,
  );

  return {
    ids,
    count: ids.length,
    isInGuestWishlist: (productId: string) => ids.includes(productId),
  };
}
