import "server-only";

import { API_URL } from "@/shared/lib/constants/config";

import type { WishlistItem } from "../types/wishlist.types";
import { IApiResponse } from "@/shared/lib/types/api";

export async function getWishlist(
  accessToken: string,
): Promise<WishlistItem[]> {
  const response = await fetch(`${API_URL}/wishlist`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data: IApiResponse<{ wishlistItems: WishlistItem[] }> =
    await response.json();

  if (!data.status) throw new Error(data.message);

  return data.payload.wishlistItems;
}
