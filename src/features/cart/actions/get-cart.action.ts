"use server";

import { getCartMutation } from "../server/get-cart.mutation";

export async function getCartAction() {
  return getCartMutation();
}
