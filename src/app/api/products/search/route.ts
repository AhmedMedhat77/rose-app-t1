import { NextRequest, NextResponse } from "next/server";

import { API_URL } from "@/app/shared/constants/config";
const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 20;
const MAX_SEARCH_LENGTH = 200;

export async function GET(request: NextRequest) {
  if (!API_URL) {
    return NextResponse.json(
      { message: "API_URL is not configured" },
      { status: 500 },
    );
  }

  const { searchParams } = request.nextUrl;
  const search = (searchParams.get("search") ?? "")
    .trim()
    .slice(0, MAX_SEARCH_LENGTH);
  const requestedLimit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), MAX_LIMIT)
    : DEFAULT_LIMIT;

  const url = new URL("/api/products", API_URL);
  url.searchParams.set("limit", String(limit));
  if (search) url.searchParams.set("search", search);

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch products" },
        { status: response.status },
      );
    }
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json(
      { message: "Products service is unreachable" },
      { status: 502 },
    );
  }
}
