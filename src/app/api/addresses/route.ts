import { NextResponse } from "next/server";

import { addressPayloadSchema } from "@/features/addresses/schemas/addresses.schema";

import type {
  IAddressPayload,
  IAddressesPayload,
} from "@/features/addresses/types/addresses.types";
import { ApiError, apiFetch } from "@/shared/lib/apis/fetch.api";

// helper function
function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        status: false,
        code: error.code,
        message: error.message,
      },
      { status: error.code ?? 500 },
    );
  }

  return NextResponse.json(
    {
      status: false,
      code: 500,
      message: "Internal server error",
    },
    { status: 500 },
  );
}

// GET addresses function
export async function GET() {
  try {
    const response = await apiFetch<IAddressesPayload>("/addresses", {
      method: "GET",
      auth: true,
    });

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST address function
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const validation = addressPayloadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const response = await apiFetch<IAddressPayload>("/addresses", {
      method: "POST",
      auth: true,
      body: validation.data,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
