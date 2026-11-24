import "server-only";

import { getServerSession } from "next-auth";

import { API_URL } from "@/app/shared/constants/config";
import { authOptions } from "@/auth";
import type { ISuccessResponse } from "@/shared/types/api";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiQuery = Record<string, string | number | boolean | undefined>;

export interface ApiFetchOptions extends Omit<RequestInit, "method" | "body"> {
  method?: ApiMethod;
  /** Plain objects are JSON-encoded. FormData, strings, and blobs are sent as-is. */
  body?: unknown;
  /** Query params appended to the URL. Undefined values are skipped. */
  query?: ApiQuery;
  /**
   * `true` sends the current session access token and throws 401 when signed out.
   * A string is sent as the bearer token directly.
   */
  auth?: boolean | string;
  next?: { revalidate?: number | false; tags?: string[] };
}

export class ApiError extends Error {
  readonly status: boolean;
  readonly code?: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = false;
    this.code = code;
  }
}

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function resolveToken(auth: ApiFetchOptions["auth"]) {
  if (!auth) return undefined;
  if (typeof auth === "string") return auth;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new ApiError(401, "Unauthorized");
  return session.accessToken;
}

function requireApiBase() {
  if (!API_URL) throw new ApiError(500, "API_URL is not configured");

  const withSlash = API_URL.endsWith("/") ? API_URL : `${API_URL}/`;
  let base: URL;

  try {
    base = new URL(withSlash);
  } catch {
    throw new ApiError(500, "API_URL is not configured");
  }

  if (base.protocol !== "http:" && base.protocol !== "https:") {
    throw new ApiError(500, "API_URL is not configured");
  }

  return base;
}

function buildUrl(path: string, query?: ApiQuery) {
  const url = new URL(path.replace(/^\//, ""), requireApiBase());

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  return url;
}

function isRawBody(body: unknown): body is BodyInit {
  return (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer
  );
}

function encodeBody(body: unknown, headers: Headers) {
  if (body === undefined) return undefined;
  if (isRawBody(body)) return body;

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return JSON.stringify(body);
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function bodyMessage(data: unknown) {
  if (!isRecord(data) || typeof data.message !== "string" || !data.message) {
    return undefined;
  }

  return data.message;
}

function throwIfFailed(response: Response, data: unknown) {
  const statusFailed = isRecord(data) && data.status === false;
  if (response.ok && !statusFailed) return;

  throw new ApiError(
    response.status,
    bodyMessage(data) ?? (response.statusText || "Request failed"),
  );
}

function readSuccess<T>(
  response: Response,
  data: unknown,
): ISuccessResponse<T> {
  if (
    !isRecord(data) ||
    data.status !== true ||
    typeof data.code !== "number"
  ) {
    throw new ApiError(
      response.status,
      bodyMessage(data) ?? "Unexpected response",
    );
  }

  return {
    status: true,
    code: data.code,
    message: typeof data.message === "string" ? data.message : "",
    payload: ("payload" in data ? data.payload : undefined) as T,
  };
}

/**
 * Server-side fetch against API_URL.
 * Returns the success envelope. `T` is `payload`.
 * Throws ApiError on a non-2xx status, `{ status: false }`, or a 2xx body without `status: true` and a numeric `code`.
 */
export async function apiFetch<T>(
  path: string,
  { method = "GET", body, query, auth, headers, ...init }: ApiFetchOptions = {},
): Promise<ISuccessResponse<T>> {
  const token = await resolveToken(auth);
  const finalHeaders = new Headers(headers);
  finalHeaders.set("Accept", "application/json");
  if (token) finalHeaders.set("Authorization", `Bearer ${token}`);

  const response = await fetch(buildUrl(path, query), {
    ...init,
    method,
    headers: finalHeaders,
    body: encodeBody(body, finalHeaders),
  });

  const data = await readBody(response);
  throwIfFailed(response, data);
  return readSuccess<T>(response, data);
}
