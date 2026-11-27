"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clearCartAction } from "../actions/clear-cart.action";
import { cartQueryKey } from "./use-cart";

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return clearCartAction();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      });
    },
  });
}
