import type { IProduct } from "@/features/products/types/product";

export async function fetchGuestWishlistProducts(
  ids: string[],
): Promise<IProduct[]> {
  const params = new URLSearchParams({ ids: ids.join(",") });
  const response = await fetch(`/api/wishlist/guest-products?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to load products (${response.status})`);
  }

  return response.json();
}
