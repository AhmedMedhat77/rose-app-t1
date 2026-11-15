"use server";

import { addCartItemMutation } from "../server/add-cart-item.mutation";

import type { IAddToCartPayload } from "../types/cart.types";

export async function addCartItemAction(payload: IAddToCartPayload) {
  return addCartItemMutation(payload);
}
