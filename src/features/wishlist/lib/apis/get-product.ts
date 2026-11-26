import "server-only";

import { API_URL } from "@/shared/lib/constants/config";
import type { IProduct } from "@/features/products/types/product";
import { IApiResponse } from "@/shared/lib/types/api";

export async function getProduct(productId: string): Promise<IProduct | null> {
  const response = await fetch(
    `${API_URL}/products/${encodeURIComponent(productId)}`,
    { cache: "no-store" },
  );

  const data: IApiResponse<{ product: IProduct }> = await response.json();

  if (!data.status) {
    if (data.code === 404) return null;
    throw new Error(data.message);
  }

  return data.payload.product;
}
