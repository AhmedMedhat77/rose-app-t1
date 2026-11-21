"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeCartItemAction } from "../actions/remove-cart-item.action";
import { cartQueryKey } from "./use-cart";

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: string) => {
      return removeCartItemAction(cartItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      });
    },
  });
}
