"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unwrapActionResult } from "../lib/utils/unwrap-action-result";
import { addToWishlistAction } from "../lib/actions/wishlist.actions";
import { WishlistItem } from "../lib/types/wishlist.types";
import { WISHLIST_QUERY_KEY } from "../lib/constants/wishlist-constants";

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) =>
      unwrapActionResult(await addToWishlistAction(productId)),
    onSuccess: (item) => {
      queryClient.setQueryData<WishlistItem[]>(
        WISHLIST_QUERY_KEY,
        (items = []) => [...items, item],
      );
    },
    onError: () =>
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY }),
  });
}
