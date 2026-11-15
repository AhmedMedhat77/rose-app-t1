"use server";

import { updateCartItemMutation } from "../server/update-cart-item.mutation";

export async function updateCartItemAction(
  cartItemId: string,
  quantity: number,
) {
  return updateCartItemMutation(cartItemId, quantity);
}
