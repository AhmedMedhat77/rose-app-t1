import type {
  ProfileResponse,
  UpdateProfilePayload,
  UploadResponse,
  UserProfile,
} from "../types/profile.types";

// ASSUMPTION: replace `request` with the project's shared HTTP client / auth handling.
// This version assumes cookie-based auth and NEXT_PUBLIC_API_URL as the base URL.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const hasJsonBody = typeof init.body === "string";

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(hasJsonBody && { "Content-Type": "application/json" }),
      ...init.headers,
      ...(process.env.NEXT_PUBLIC_DEV_TOKEN && {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEV_TOKEN}`,
      }),
    },
  });

  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
  }

  if (!response.ok) {
    const message =
      (data as { message?: string } | undefined)?.message ??
      response.statusText;
    throw new ApiError(response.status, message);
  }

  return data as T;
}

export async function getProfile(): Promise<UserProfile> {
  const res = await request<ProfileResponse>("/api/users/profile");
  return res.payload.user;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<UserProfile> {
  const res = await request<ProfileResponse>("/api/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res.payload.user;
}

/** Uploads to the temp cache and returns the temp URL to send as `photo` in the PATCH body. */
export async function uploadProfilePhoto(file: File): Promise<string> {
  const body = new FormData();
  body.append("image", file);
  const res = await request<UploadResponse>("/api/upload", {
    method: "POST",
    body,
  });
  return res.payload.url;
}

export async function deleteAccount(): Promise<void> {
  await request<unknown>("/api/users/account", { method: "DELETE" });
}
