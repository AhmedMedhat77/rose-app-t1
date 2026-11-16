"use client";

import { useQuery } from "@tanstack/react-query";

import { getCartAction } from "../actions/get-cart.action";

export const cartQueryKey = ["cart"] as const;

export function useCart(enabled = true) {
  return useQuery({
    queryKey: cartQueryKey,
    queryFn: () => getCartAction(),
    enabled,
  });
}
