import "server-only";

import { cartRequest } from "./cart-request";

import type { ICartResponse } from "../types/cart.types";

export async function getCartApi() {
  return cartRequest<ICartResponse>({
    method: "GET",
    endpoint: "",
  });
}
