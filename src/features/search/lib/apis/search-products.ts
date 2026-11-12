import type {
  IApiResponse,
  IProduct,
  IProductsPayload,
} from "@/features/products/types/product";

export async function searchProducts(query: string): Promise<IProduct[]> {
  const params = new URLSearchParams({ limit: "6" });
  if (query) params.set("search", query);

  const res = await fetch(`/api/products/search?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to search products");

  const json: IApiResponse<IProductsPayload> = await res.json();
  return json.payload.data;
}
