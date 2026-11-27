import "server-only";

import { getAccessToken } from "./get-access-token";
import { apiFetch } from "@/shared/lib/apis/fetch.api";

interface ICartRequestOptions {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  endpoint?: string;
  body?: unknown;
}

export async function cartRequest<T>({
  method,
  endpoint = "",
  body,
}: ICartRequestOptions): Promise<T> {
  const accessToken = await getAccessToken();

  const result = await apiFetch<T>(`/cart${endpoint}`, {
    method,
    auth: accessToken,
    body,
    cache: "no-store",
  });

  return result.payload;
}
