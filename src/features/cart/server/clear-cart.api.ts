import "server-only";

import { cartRequest } from "./cart-request";

export async function clearCartMutation() {
  return cartRequest<string>({
    method: "DELETE",
    endpoint: "",
  });
}
