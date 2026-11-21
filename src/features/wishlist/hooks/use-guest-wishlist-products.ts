"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useGuestWishlist } from "./use-guest-wishlist";
import { getGuestWishlistProductsAction } from "../lib/actions/guest-wishlist.actions";
import { removeGuestWishlistItems } from "../lib/utils/guest-wishlist-storage";

export function useGuestWishlistProducts(enabled: boolean) {
  const { ids } = useGuestWishlist();

  const query = useQuery({
    queryKey: ["wishlist", "guest-products", ids],
    queryFn: () => getGuestWishlistProductsAction(ids),
    enabled: enabled && ids.length > 0,
    placeholderData: keepPreviousData,
  });

  // hide products that were removed a moment ago, before the refetch finishes
  const products = (query.data ?? []).filter((product) =>
    ids.includes(product.id),
  );

  // forget saved ids whose products no longer exist
  useEffect(() => {
    if (!query.isSuccess || query.isPlaceholderData) return;

    const foundIds = query.data.map((product) => product.id);
    removeGuestWishlistItems(ids.filter((id) => !foundIds.includes(id)));
  }, [query.isSuccess, query.isPlaceholderData, query.data, ids]);

  return {
    products,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
