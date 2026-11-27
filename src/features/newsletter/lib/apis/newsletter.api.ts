import "server-only";

import { ApiError, apiFetch } from "@/shared/lib/apis/fetch.api";
import type { SubscribeResult } from "../types/newsletter";

export async function subscribeToNewsletter(
  email: string,
): Promise<SubscribeResult> {
  try {
    await apiFetch<unknown>("/subscriptions", {
      method: "POST",
      body: { email },
    });
    return "subscribed";
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    if (error.code === 409) return "already-subscribed";
    if (error.code === 400) return "error";
    throw error;
  }
}
