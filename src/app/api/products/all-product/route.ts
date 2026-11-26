import { API_URL } from "@/app/shared/constants/config";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = API_URL;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const apiUrl = new URL(`${BASE_URL}/products`);

    searchParams.forEach((value, key) => {
      apiUrl.searchParams.set(key, value);
    });

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          status: false,
          message: "Failed to fetch products",
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Products API Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
