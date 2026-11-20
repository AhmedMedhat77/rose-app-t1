"use client";

import { useQuery } from "@tanstack/react-query";

import type { ICartResponse } from "../types/cart.types";

export const cartQueryKey = ["cart"] as const;

async function fetchCart(): Promise<ICartResponse> {
  const response = await fetch("/api/cart", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to fetch cart.");
  }

  return result;
}

export function useCart(enabled = true) {
  return useQuery({
    queryKey: cartQueryKey,
    queryFn: fetchCart,
    enabled,
  });
}
