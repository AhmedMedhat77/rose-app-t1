"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unwrapActionResult } from "../lib/utils/unwrap-action-result";
import { clearWishlistAction } from "../lib/actions/wishlist.actions";
import { WISHLIST_QUERY_KEY } from "../lib/constants/wishlist-constants";
import { WishlistItem } from "../lib/types/wishlist.types";

export function useClearWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => unwrapActionResult(await clearWishlistAction()),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const previous =
        queryClient.getQueryData<WishlistItem[]>(WISHLIST_QUERY_KEY);

      queryClient.setQueryData<WishlistItem[]>(WISHLIST_QUERY_KEY, []);

      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(WISHLIST_QUERY_KEY, context?.previous);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY }),
  });
}
