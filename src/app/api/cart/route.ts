import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { getCartApi } from "@/features/cart/server/get-cart.api";

export async function GET(request: NextRequest) {
  try {
    const secret = process.env.NEXT_AUTH_SECRET;

    if (!secret) {
      throw new Error("NEXT_AUTH_SECRET is missing.");
    }

    const token = await getToken({ req: request, secret });

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart = await getCartApi();

    return NextResponse.json(cart);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch cart.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
