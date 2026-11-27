"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unwrapActionResult } from "../lib/utils/unwrap-action-result";
import { removeWishlistItemAction } from "../lib/actions/wishlist.action";
import { WISHLIST_QUERY_KEY } from "../lib/constants/wishlist-constants";
import { WishlistItem } from "../lib/types/wishlist.types";

export function useRemoveWishlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) =>
      unwrapActionResult(await removeWishlistItemAction(itemId)),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const previous =
        queryClient.getQueryData<WishlistItem[]>(WISHLIST_QUERY_KEY);

      queryClient.setQueryData<WishlistItem[]>(
        WISHLIST_QUERY_KEY,
        (items = []) => items.filter((item) => item.id !== itemId),
      );

      return { previous };
    },
    onError: (_error, _itemId, context) => {
      queryClient.setQueryData(WISHLIST_QUERY_KEY, context?.previous);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY }),
  });
}
