"use client";

import { useQuery } from "@tanstack/react-query";

import { getProductById } from "../lib/apis/products.api";
import { getProductsByCategory } from "../lib/apis/products.api";
import { PRODUCT_QUERY_KEYS } from "../lib/constants/product.constants";

export function useProductById(id: string) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.product(id),
    queryFn: () => getProductById(id),
    enabled: id.length > 0,
  });
}

export const useProductId = useProductById;

export function useRelatedProducts(categoryId: string) {
  return useQuery({
    queryKey: ["products", "related", categoryId],
    queryFn: () => getProductsByCategory(categoryId),
    enabled: categoryId.length > 0,
  });
}
