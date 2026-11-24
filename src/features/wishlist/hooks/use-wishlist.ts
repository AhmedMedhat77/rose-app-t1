"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getWishlistAction } from "../lib/actions/wishlist.actions";
import { WISHLIST_QUERY_KEY } from "../lib/constants/wishlist-constants";

export function useWishlist() {
  const { status } = useSession();

  const query = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    enabled: status === "authenticated",
    queryFn: async () => {
      const result = await getWishlistAction();
      if (!result.ok) throw new Error(`Wishlist failed (${result.status})`);
      return result.data;
    },
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
