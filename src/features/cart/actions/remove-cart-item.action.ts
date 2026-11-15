"use server";

import { removeCartItemMutation } from "../server/remove-cart-item.mutation";

export async function removeCartItemAction(cartItemId: string) {
  return removeCartItemMutation(cartItemId);
}
