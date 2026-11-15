"use server";

import { clearCartMutation } from "../server/clear-cart.mutation";

export async function clearCartAction() {
  return clearCartMutation();
}
