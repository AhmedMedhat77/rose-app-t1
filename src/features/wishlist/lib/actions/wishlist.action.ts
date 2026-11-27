"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import type {
  WishlistActionResult,
  WishlistItem,
} from "../types/wishlist.types";
import { WishlistRequestError } from "../apis/wishlist-request-error";
import { addToWishlist } from "../apis/add-to-wishlist";
import { removeWishlistItem } from "../apis/remove-wishlist-item";
import { clearWishlist } from "../apis/clear-wishlist";

async function runAuthenticated<T>(
  operation: (accessToken: string) => Promise<T>,
): Promise<WishlistActionResult<T>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    //return { ok: false, status: 401 };
    throw new WishlistRequestError(401, "Unauthorized");
  }

  try {
    return { ok: true, data: await operation(session.accessToken) };
  } catch (error) {
    const status = error instanceof WishlistRequestError ? error.status : 500;
    return { ok: false, status };
  }
}

// export async function getWishlistAction(): Promise<
//   WishlistActionResult<WishlistItem[]>
// > {
//   return runAuthenticated(getWishlist);
// }

export async function addToWishlistAction(
  productId: string,
): Promise<WishlistActionResult<WishlistItem>> {
  if (!productId) return { ok: false, status: 400 };
  return runAuthenticated((token) => addToWishlist(token, productId));
}

export async function removeWishlistItemAction(
  itemId: string,
): Promise<WishlistActionResult<void>> {
  if (!itemId) return { ok: false, status: 400 };
  return runAuthenticated((token) => removeWishlistItem(token, itemId));
}

export async function clearWishlistAction(): Promise<
  WishlistActionResult<void>
> {
  return runAuthenticated(clearWishlist);
}
