"use server";

import { addCartItemMutation } from "../server/cart.mutations";

import type { IAddToCartPayload } from "../types/cart.types";

export async function addCartItemAction(
  payload: IAddToCartPayload,
  expectedUserId: string,
) {
  if (!expectedUserId) {
    throw new Error("User ID is required");
  }

  return addCartItemMutation(payload, expectedUserId);
}
