import "server-only";

import { cartRequest } from "./cart-request";

export async function removeCartItemMutation(cartItemId: string) {
  return cartRequest<string>({
    method: "DELETE",
    endpoint: `/${cartItemId}`,
  });
}
