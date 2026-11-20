"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { WishlistItem } from "../lib/types/wishlist.types";
import { fetchWishlist } from "../lib/apis/fetch-wishlist";

export const WISHLIST_QUERY_KEY = ["wishlist"] as const;

export function useWishlist(initialItems?: WishlistItem[]) {
  const { status } = useSession();

  const query = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    enabled: status === "authenticated",
    queryFn: fetchWishlist,
    initialData: initialItems,
  });

  const items = query.data ?? [];

  return {
    items,
    count: items.length,
    isLoading: status === "loading" || query.isLoading,
    isError: query.isError,
    isInWishlist: (productId: string) =>
      items.some((item) => item.productId === productId),
    getItemId: (productId: string) =>
      items.find((item) => item.productId === productId)?.id,
  };
}
