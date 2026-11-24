import { NextRequest, NextResponse } from "next/server";

import { apiFetch, ApiError } from "@/shared/lib/apis/fetch.api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const response = await apiFetch(`/products/${encodeURIComponent(id)}`, {
      method: "GET",
      signal: request.signal,
    });

    if (!response.payload) {
      throw new ApiError(404, "Product not found");
    }

    return NextResponse.json(response);
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
