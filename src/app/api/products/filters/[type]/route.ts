import "server-only";
import { NextRequest, NextResponse } from "next/server";

import { HEADERS } from "@/shared/lib/constants/api.constant";
import {
  CATEGORY_ENDPOINT,
  OCCASIONS_ENDPOINT,
} from "@/features/products/lib/apis/product.endpoint";

const FILTER_ENDPOINTS = {
  categories: CATEGORY_ENDPOINT,
  occasions: OCCASIONS_ENDPOINT,
} as const;

const fail = (message: string, status: number) =>
  NextResponse.json({ status: false, message }, { status });

const toPositiveInt = (value: string | null) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : null;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;

  if (!Object.hasOwn(FILTER_ENDPOINTS, type)) {
    return fail("Invalid filter type", 404);
  }

  const { searchParams } = request.nextUrl;
  const page = toPositiveInt(searchParams.get("page"));
  const limit = toPositiveInt(searchParams.get("limit"));

  if (!page || !limit) return fail("Invalid pagination parameters", 400);

  const apiUrl = process.env.API_URL?.replace(/\/+$/, "");
  if (!apiUrl) return fail("API URL is not configured", 500);

  const endpoint = FILTER_ENDPOINTS[type as keyof typeof FILTER_ENDPOINTS];
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  try {
    const response = await fetch(`${apiUrl}/${endpoint}?${query}`, {
      headers: HEADERS.ACCEPT_JSON,
      signal: request.signal,
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    console.error("[filters] upstream fetch failed:", error);
    return fail("Unable to reach the backend API", 502);
  }
}
