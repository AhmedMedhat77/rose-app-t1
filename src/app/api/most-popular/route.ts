import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/shared/constants/config";

export async function GET(request: NextRequest) {
  const baseUrl = API_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { message: "base url is not defined" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const occasionId = searchParams.get("occasionId") ?? "";

  const params = new URLSearchParams({
    sortBy: "mostPopular",
    occasionId,
    limit: "12",
  });

  try {
    const response = await fetch(`${baseUrl}/products?${params.toString()}`, {
      method: "GET",
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch products" },
        { status: response.status },
      );
    }

    const result = await response.json();

    return NextResponse.json(result.payload.data);
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
