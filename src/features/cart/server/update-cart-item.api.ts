import "server-only";

import { cartRequest } from "./cart-request";

export async function updateCartItemMutation(
  cartItemId: string,
  quantity: number,
) {
  return cartRequest<string>({
    method: "PATCH",
    endpoint: `/${cartItemId}`,
    body: { quantity },
  });
}
