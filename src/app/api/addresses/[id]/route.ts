import { NextResponse } from "next/server";

import { updateAddressPayloadSchema } from "@/features/addresses/schemas/addresses.schema";

import type { IAddressPayload } from "@/features/addresses/types/addresses.types";
import { ApiError, apiFetch } from "@/shared/lib/apis/fetch.api";

// types
interface RouteContext {
  params: Promise<{ id: string }>;
}
// helper function
function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    const statusCode =
      error.code && error.code >= 400 && error.code <= 599 ? error.code : 500;

    return NextResponse.json(
      {
        status: false,
        code: statusCode,
        message: error.message,
      },
      { status: statusCode },
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

// GET address function
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const response = await apiFetch<IAddressPayload>(`/addresses/${id}`, {
      method: "GET",
      auth: true,
    });

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// update adress function
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body: unknown = await request.json();

    const validation = updateAddressPayloadSchema.safeParse(body);

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

    const response = await apiFetch<IAddressPayload>(`/addresses/${id}`, {
      method: "PATCH",
      auth: true,
      body: validation.data,
    });

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE address function
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const response = await apiFetch<unknown>(`/addresses/${id}`, {
      method: "DELETE",
      auth: true,
    });

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
