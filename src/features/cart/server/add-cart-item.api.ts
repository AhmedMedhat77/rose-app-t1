import "server-only";

import { cartRequest } from "./cart-request";

import type { IAddToCartPayload } from "../types/cart.types";

export async function addCartItemMutation(payload: IAddToCartPayload) {
  return cartRequest<string>({
    method: "POST",
    body: payload,
  });
}
