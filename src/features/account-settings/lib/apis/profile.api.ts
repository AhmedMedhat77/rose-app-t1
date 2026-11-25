import "server-only";

import { ApiError, apiFetch } from "@/shared/lib/apis/fetch.api";

import { PROFILE_TAG_PREFIX } from "../constants/account-settings.constant";
import type { UpdateProfilePayload, UserProfile } from "../types/profile.types";

export function profileCacheTag(userId: string) {
  return `${PROFILE_TAG_PREFIX}:${userId}`;
}

export async function getProfile(
  accessToken: string,
  userId: string,
): Promise<UserProfile> {
  const result = await apiFetch<{ user: UserProfile }>("/users/profile", {
    auth: accessToken,
    next: { tags: [profileCacheTag(userId)] },
  });

  if (!result.payload?.user) {
    throw new ApiError(500, "Failed to load profile");
  }

  return result.payload.user;
}

export async function updateProfile(
  accessToken: string,
  payload: UpdateProfilePayload,
): Promise<UserProfile> {
  const result = await apiFetch<{ user: UserProfile }>("/users/profile", {
    method: "PATCH",
    auth: accessToken,
    body: payload,
  });

  if (!result.payload?.user) {
    throw new ApiError(500, "Failed to update profile");
  }

  return result.payload.user;
}

/** Uploads to the temp cache and returns `payload.url` for the PATCH `photo` field. */
export async function uploadProfilePhoto(
  accessToken: string,
  file: File,
): Promise<string> {
  const body = new FormData();
  body.append("image", file);
  const result = await apiFetch<{ url: string }>("/upload", {
    method: "POST",
    auth: accessToken,
    body,
  });

  if (!result.payload?.url) {
    throw new ApiError(500, "Failed to upload photo");
  }

  return result.payload.url;
}

export async function deleteAccount(accessToken: string): Promise<void> {
  await apiFetch<void>("/users/account", {
    method: "DELETE",
    auth: accessToken,
  });
}
