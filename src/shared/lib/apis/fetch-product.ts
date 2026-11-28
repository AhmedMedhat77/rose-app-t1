import type { IProductOverview } from "@/features/products/types/product";

export async function fetchProduct(
  productId: string,
  signal?: AbortSignal,
): Promise<IProductOverview | null> {
  const response = await fetch(
    `/api/products/${encodeURIComponent(productId)}`,
    { cache: "no-store", signal },
  );

  if (response.status === 404) return null;
  if (!response.ok)
    throw new Error(`Failed to load product (${response.status})`);

  return response.json();
}
