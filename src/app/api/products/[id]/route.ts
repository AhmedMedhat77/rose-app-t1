import { NextRequest, NextResponse } from "next/server";

import { API_URL } from "@/app/shared/constants/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!API_URL) {
    return NextResponse.json(
      { status: false, message: "Products service is unavailable" },
      { status: 500 },
    );
  }

  const { id } = await params;

  try {
    const response = await fetch(
      `${API_URL}/products/${encodeURIComponent(id)}`,
      { cache: "no-store", signal: request.signal },
    );

    return NextResponse.json(await response.json(), {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { status: false, message: "Products service is unreachable" },
      { status: 502 },
    );
  }
}
