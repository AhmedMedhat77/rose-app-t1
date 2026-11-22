import "server-only";

import { API_URL } from "@/app/shared/constants/config";
import { IApiResponse } from "@/shared/types/api";
import { IClearWishlistSuccessResponse } from "../types/wishlist.types";

export async function removeWishlistItem(
  accessToken: string,
  itemId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/wishlist/${encodeURIComponent(itemId)}`,
    {
      method: "DELETE",
      cache: "no-store",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  const data: IApiResponse<IClearWishlistSuccessResponse> =
    await response.json();

  if (!data.status) throw new Error(data.message);
}
