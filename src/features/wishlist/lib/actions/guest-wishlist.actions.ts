"use server";

import { IProduct } from "@/features/products/types/product";
import { getProduct } from "../apis/get-product";

const MAX_GUEST_WISHLIST_ITEMS = 100;

export async function getGuestWishlistProductsAction(
  productIds: string[],
): Promise<IProduct[]> {
  if (!Array.isArray(productIds)) return [];

  const ids = [...new Set(productIds)]
    .filter((id) => typeof id === "string" && id.length > 0)
    .slice(0, MAX_GUEST_WISHLIST_ITEMS);

  const products = await Promise.all(ids.map((id) => getProduct(id)));

  return products.filter((product): product is IProduct => product !== null);
}
