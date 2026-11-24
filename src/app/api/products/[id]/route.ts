import { NextRequest, NextResponse } from "next/server";

import { apiFetch } from "@/shared/lib/apis/fetch.api";
import { ApiError } from "next/dist/server/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const response = await apiFetch(`/products`, {
    method: "GET",
    query: { id },
    signal: request.signal,
  });

  if (!response.payload) {
    throw new ApiError(response.code, response.message);
  }
  return NextResponse.json(response);
}
