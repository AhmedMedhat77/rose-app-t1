import type { WishlistItem } from "../types/wishlist.types";

export async function fetchWishlist(): Promise<WishlistItem[]> {
  const response = await fetch("/api/wishlist");

  if (!response.ok) {
    throw new Error(`Failed to load wishlist (${response.status})`);
  }

  return response.json();
}
