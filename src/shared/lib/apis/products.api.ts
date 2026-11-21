import "server-only";

import { API_URL } from "@/app/shared/constants/config";
import type { IProduct } from "@/features/products/types/product";
import type { IPaginatedResponse } from "@/shared/types/api";

export async function getProducts(url: string): Promise<IProduct[]> {
  if (!API_URL) throw new Error("API_URL is not configured");

  const response = await fetch(`${API_URL}${url}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300, tags: ["products"] },
  });

  const body: IPaginatedResponse<IProduct> = await response.json();
  if (!response.ok || !body.status) {
    throw new Error("Failed to fetch products");
  }

  return body.payload.data;
}
