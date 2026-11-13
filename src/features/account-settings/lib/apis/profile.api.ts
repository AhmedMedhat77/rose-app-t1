import "server-only";

import { API_URL } from "@/app/shared/constants/config";
import { HEADERS } from "@/app/shared/constants/api.constant";

import { PROFILE_TAG_PREFIX } from "../constants/account-settings.constant";
import type { UpdateProfilePayload, UserProfile } from "../types/profile.types";

export function profileCacheTag(userId: string) {
  return `${PROFILE_TAG_PREFIX}:${userId}`;
}

export class ProfileRequestError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ProfileRequestError";
    this.status = status;
  }
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function failureStatus(data: unknown, responseStatus: number) {
  if (
    data &&
    typeof data === "object" &&
    "code" in data &&
    typeof data.code === "number"
  ) {
    return data.code;
  }

  return responseStatus;
}

async function request<T>(
  path: string,
  accessToken: string,
  init: RequestInit & { next?: { tags?: string[] } } = {},
): Promise<T | undefined> {
  if (!API_URL) {
    throw new ProfileRequestError(500, "API_URL is not configured");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await readBody(response);
  const body = data as { status?: boolean; payload?: T } | undefined;

  if (!response.ok || body?.status === false) {
    throw new ProfileRequestError(
      failureStatus(data, response.status),
      "Request failed",
    );
  }

  return body?.payload;
}

export async function getProfile(
  accessToken: string,
  userId: string,
): Promise<UserProfile> {
  const payload = await request<{ user: UserProfile }>(
    "/users/profile",
    accessToken,
    { next: { tags: [profileCacheTag(userId)] } },
  );

  if (!payload?.user) {
    throw new ProfileRequestError(500, "Failed to load profile");
  }

  return payload.user;
}

export async function updateProfile(
  accessToken: string,
  payload: UpdateProfilePayload,
): Promise<UserProfile> {
  const result = await request<{ user: UserProfile }>(
    "/users/profile",
    accessToken,
    {
      method: "PATCH",
      headers: HEADERS.JSON_HEADER,
      body: JSON.stringify(payload),
    },
  );

  if (!result?.user) {
    throw new ProfileRequestError(500, "Failed to update profile");
  }

  return result.user;
}

/** Uploads to the temp cache and returns `payload.url` for the PATCH `photo` field. */
export async function uploadProfilePhoto(
  accessToken: string,
  file: File,
): Promise<string> {
  const body = new FormData();
  body.append("image", file);

  const payload = await request<{ url: string }>("/upload", accessToken, {
    method: "POST",
    body,
  });

  if (!payload?.url) {
    throw new ProfileRequestError(500, "Failed to upload photo");
  }

  return payload.url;
}

export async function deleteAccount(accessToken: string): Promise<void> {
  await request<unknown>("/users/account", accessToken, { method: "DELETE" });
}
