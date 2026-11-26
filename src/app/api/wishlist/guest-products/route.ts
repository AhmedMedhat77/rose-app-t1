import { NextRequest, NextResponse } from "next/server";

import type { IProduct } from "@/features/products/types/product";
import { getProduct } from "@/features/wishlist/lib/apis/get-product";

const MAX_IDS = 100;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("ids") ?? "";

  // ids that are not valid uuids are treated as "not found"
  const ids = [...new Set(raw.split(",").map((id) => id.trim()))]
    .filter((id) => UUID_PATTERN.test(id))
    .slice(0, MAX_IDS);

  try {
    const products = await Promise.all(ids.map((id) => getProduct(id)));

    return NextResponse.json(
      products.filter((product): product is IProduct => product !== null),
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to load products" },
      { status: 502 },
    );
  }
}
