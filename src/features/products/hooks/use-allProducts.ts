"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllProducts } from "../lib/apis/api-allProducts";
import { GetAllProductsParams } from "../types/allProducts";

export default function useAllProducts(params: GetAllProductsParams) {
  return useQuery({
    queryKey: ["allProducts", params],

    queryFn: () => getAllProducts(params),

    placeholderData: keepPreviousData,
  });
}
