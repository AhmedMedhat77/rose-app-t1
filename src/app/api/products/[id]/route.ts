import { NextRequest, NextResponse } from "next/server";

import { HEADERS } from "@/shared/lib/constants/api.constant";
import { PRODUCT_ENDPOINT } from "@/features/products/lib/apis/product.endpoint";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const apiUrl = process.env.API_URL?.replace(/\/+$/, "");

  if (!apiUrl) {
    return NextResponse.json(
      { status: false, message: "API URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `${apiUrl}/${PRODUCT_ENDPOINT}/${encodeURIComponent(id)}`,
      { headers: HEADERS.ACCEPT_JSON, signal: request.signal },
    );

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;

    return NextResponse.json(
      { status: false, message: "Unable to reach the backend API" },
      { status: 502 },
    );
  }
}
