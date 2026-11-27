import { NextRequest, NextResponse } from "next/server";

import { ApiError } from "@/shared/lib/apis/fetch.api";
import { getProductById } from "@/shared/lib/apis/products.api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const product = await getProductById(id, {
      signal: request.signal,
    });

    if (!product) {
      return NextResponse.json(
        { status: false, code: 404, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Get product API error:", error);

    const status =
      error instanceof ApiError &&
      error.code &&
      error.code >= 400 &&
      error.code <= 599
        ? error.code
        : 500;

    return NextResponse.json(
      {
        status: false,
        code: status,
        message:
          error instanceof Error ? error.message : "Failed to fetch product",
      },
      { status },
    );
  }
}
