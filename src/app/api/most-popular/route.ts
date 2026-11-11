import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_BASE_URL is not defined" },
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
    const response = await fetch(
      `${baseUrl}api/products?${params.toString()}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
        },
      },
    );

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
