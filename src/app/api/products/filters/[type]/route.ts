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

type FilterType = keyof typeof FILTER_ENDPOINTS;

interface RouteContext {
  params: Promise<{ type: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { type } = await params;

  if (!Object.hasOwn(FILTER_ENDPOINTS, type)) {
    return NextResponse.json(
      { status: false, message: "Invalid filter type" },
      { status: 404 },
    );
  }

  const page = request.nextUrl.searchParams.get("page");
  const limit = request.nextUrl.searchParams.get("limit");

  if (
    !page ||
    !limit ||
    !Number.isInteger(Number(page)) ||
    !Number.isInteger(Number(limit)) ||
    Number(page) < 1 ||
    Number(limit) < 1
  ) {
    return NextResponse.json(
      { status: false, message: "Invalid pagination parameters" },
      { status: 400 },
    );
  }

  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { status: false, message: "API URL is not configured" },
      { status: 500 },
    );
  }

  const endpoint = FILTER_ENDPOINTS[type as FilterType];
  const query = new URLSearchParams({ page, limit });

  try {
    const response = await fetch(
      `${apiUrl.replace(/\/+$/, "")}/${endpoint}?${query}`,
      {
        headers: HEADERS.ACCEPT_JSON,
        signal: request.signal,
      },
    );

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    return NextResponse.json(
      { status: false, message: "Unable to reach the backend API" },
      { status: 502 },
    );
  }
}
