import "server-only";
import {
  apiFetch,
  ApiError,
  type ApiFetchOptions,
} from "@/shared/lib/apis/fetch.api";
import type { IProduct } from "@/features/products/types/product";
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
  const response = await apiFetch<IPaginatedPayload<IProduct>>(
    `/products?${query}`,
    {
      ...options,
    },
  );
  return response.payload.data;
}
