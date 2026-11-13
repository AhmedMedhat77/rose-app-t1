import type { IProduct } from "@/features/products/types/product";
import { IPaginatedPayload, ISuccessResponse } from "@/shared/types/api";

export async function searchProducts(query: string): Promise<IProduct[]> {
  const params = new URLSearchParams({ limit: "6" });
  if (query) params.set("search", query);

  const res = await fetch(`/api/products/search?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to search products");

  const json: ISuccessResponse<IPaginatedPayload<IProduct>> = await res.json();
  return json.payload.data;
}
