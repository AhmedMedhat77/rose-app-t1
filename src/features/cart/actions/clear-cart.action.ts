"use server";

import { clearCartMutation } from "../server/clear-cart.api";

export async function clearCartAction() {
  return clearCartMutation();
}
