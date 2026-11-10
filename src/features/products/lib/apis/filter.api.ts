import type {
  IApiResponse,
  IPaginatedPayload,
  IPaginatedResponse,
} from "@/shared/types/api";

import { HEADERS } from "@/shared/lib/constants/api.constant";

interface FetchParams {
  page: number;
  limit: number;
  endpoint: string;
}

export async function fetchPaginatedListApi<T>(
  { page, limit, endpoint }: FetchParams,
  signal?: AbortSignal,
): Promise<IPaginatedResponse<T>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `/api/products/filters/${encodeURIComponent(endpoint)}?${params}`,
    {
      headers: HEADERS.ACCEPT_JSON,
      signal,
    },
  );

  const payload: IApiResponse<IPaginatedPayload<T>> = await response.json();

  if (!response.ok) {
    throw new Error(
      payload.message || `Request failed with status ${response.status}`,
    );
  }

  if (!payload.status) {
    throw new Error(payload.message);
  }

  return payload;
}
