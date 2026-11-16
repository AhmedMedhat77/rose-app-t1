"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCartItemAction } from "../actions/add-cart-item.action";

import type { IAddToCartPayload } from "../types/cart.types";
import { cartQueryKey } from "./use-cart";

export function useAddCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IAddToCartPayload) => {
      return addCartItemAction(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      });
    },
  });
}
