import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/auth";
import { getWishlist } from "@/features/wishlist/lib/apis/get-wishlist";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await getWishlist(session.accessToken));
  } catch {
    return NextResponse.json(
      { message: "Failed to load wishlist" },
      { status: 502 },
    );
  }
}
