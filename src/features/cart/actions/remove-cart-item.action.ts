"use server";

import { removeCartItemMutation } from "../server/remove-cart-item.api";

export async function removeCartItemAction(cartItemId: string) {
  return removeCartItemMutation(cartItemId);
}
