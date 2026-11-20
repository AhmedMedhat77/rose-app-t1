import "server-only";

import { API_URL } from "@/app/shared/constants/config";
import { HEADERS } from "@/app/shared/constants/api.constant";

import { getAccessToken } from "./get-access-token";

import type { IApiResponse } from "@/app/shared/types/api";

interface ICartRequestOptions {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  endpoint?: string;
  body?: unknown;
}

export async function cartRequest<T>({
  method,
  endpoint,
  body,
}: ICartRequestOptions): Promise<T> {
  if (!API_URL) {
    throw new Error("API_URL is not configured.");
  }

  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}/cart${endpoint}`, {
    method,
    headers: {
      ...HEADERS.JSON_HEADER,
      Authorization: `Bearer ${accessToken}`,
    },
    ...(body !== undefined && {
      body: JSON.stringify(body),
    }),
    cache: "no-store",
  });

  let data: IApiResponse<T>;

  try {
    data = await response.json();
  } catch {
    throw new Error(`Invalid cart response (${response.status}).`);
  }

  if (!response.ok || !data.status) {
    throw new Error(
      data.message || `Cart request failed (${response.status}).`,
    );
  }

  return data.payload;
}
