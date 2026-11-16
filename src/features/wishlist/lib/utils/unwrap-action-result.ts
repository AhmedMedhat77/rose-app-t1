import type { WishlistActionResult } from "../types/wishlist.types";

export class WishlistMutationError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Wishlist request failed (${status})`);
    this.name = "WishlistMutationError";
    this.status = status;
  }
}

export function unwrapActionResult<T>(result: WishlistActionResult<T>): T {
  if (!result.ok) throw new WishlistMutationError(result.status);
  return result.data;
}
