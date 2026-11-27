import "server-only";

import type { WishlistItem } from "../types/wishlist.types";
import { apiFetch } from "@/shared/lib/apis/fetch.api";

export async function getWishlist(
  accessToken: string,
): Promise<WishlistItem[]> {
  const { payload } = await apiFetch<{ wishlistItems: WishlistItem[] }>(
    "/wishlist",
    {
      auth: accessToken,
      cache: "no-store",
    },
  );
  return payload.wishlistItems;
}
