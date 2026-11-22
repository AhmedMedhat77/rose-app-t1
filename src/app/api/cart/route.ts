import { NextResponse } from "next/server";

import { getCartApi } from "@/features/cart/server/get-cart.api";

export async function GET() {
  try {
    const cart = await getCartApi();
    return NextResponse.json(cart);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch cart.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
