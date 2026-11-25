import "server-only";

import { HEADERS } from "@/app/shared/constants/api.constant";
import { API_URL } from "@/app/shared/constants/config";

import type { WishlistItem } from "../types/wishlist.types";
import { WishlistRequestError } from "./wishlist-request-error";
import { IApiResponse } from "@/shared/types/api";

export async function addToWishlist(
  accessToken: string,
  productId: string,
): Promise<WishlistItem> {
  const response = await fetch(`${API_URL}/wishlist`, {
    method: "POST",
    cache: "no-store",
    headers: {
      ...HEADERS.JSON_HEADER,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ productId }),
  });

  const data: IApiResponse<{ wishlistItem: WishlistItem }> =
    await response.json();

  if (!data.status) throw new WishlistRequestError(data.code, data.message);

  return data.payload.wishlistItem;
}
