"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartItemAction } from "../actions/update-cart-item.action";
import { cartQueryKey } from "./use-cart";

interface IUpdateVariables {
  cartItemId: string;
  quantity: number;
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartItemId, quantity }: IUpdateVariables) => {
      return updateCartItemAction(cartItemId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      });
    },
  });
}
