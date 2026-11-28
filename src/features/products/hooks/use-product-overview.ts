"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchProduct } from "@/shared/lib/apis/fetch-product";

export const productOverviewQueryKey = (productId: string) =>
  ["products", "detail", productId] as const;

export function useProductOverview(productId: string) {
  return useQuery({
    queryKey: productOverviewQueryKey(productId),
    queryFn: ({ signal }) => fetchProduct(productId, signal),
  });
}
