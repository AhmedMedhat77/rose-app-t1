import type { IPaginatedResponse } from "@/shared/lib/types/api";

import type { GetAllProductsParams } from "../../types/allProducts";
import type { IProduct } from "../../types/product";

export async function getAllProducts(
  params: GetAllProductsParams = {},
  signal?: AbortSignal,
): Promise<IPaginatedResponse<IProduct>> {
  const searchParams = new URLSearchParams();

  const apiParams = {
    page: params.page,
    limit: params.limit,
    categoryId: params.category,
    occasionId: params.occasion,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    minRating: params.rating,
  };

  Object.entries(apiParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  const response = await fetch(
    `/api/products/all-product${queryString ? `?${queryString}` : ""}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}
