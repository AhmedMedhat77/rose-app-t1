import "server-only";
import {
  apiFetch,
  ApiError,
  type ApiFetchOptions,
} from "@/shared/lib/apis/fetch.api";
import type {
  IProduct,
  IProductListParams,
} from "@/features/products/types/product";
import type { IPaginatedPayload } from "@/shared/lib/types/api";

export async function getProductById<T extends IProduct = IProduct>(
  id: string,
  options?: ApiFetchOptions,
): Promise<T | null> {
  try {
    const { payload } = await apiFetch<{ product: T }>(
      `/products/${encodeURIComponent(id)}`,
      options,
    );
    return payload?.product ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.code === 404) return null;
    throw error;
  }
}

export async function getProducts(
  query: string,
  options?: ApiFetchOptions,
): Promise<IProduct[]> {
  return (await getProductsPage(query, options)).data;
}

function toProductsQuery(
  params: IProductListParams | string,
): NonNullable<ApiFetchOptions["query"]> {
  if (typeof params === "string") {
    return Object.fromEntries(new URLSearchParams(params));
  }

  return {
    page: params.page,
    limit: params.limit,
    categoryId: params.category,
    occasionId: params.occasion,
    minRating: params.rating,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
  };
}

export async function getProductsPage(
  params: IProductListParams | string = {},
  options?: ApiFetchOptions,
): Promise<IPaginatedPayload<IProduct>> {
  const response = await apiFetch<IPaginatedPayload<IProduct>>("/products", {
    ...options,
    query: toProductsQuery(params),
  });

  return response.payload;
}
