"use server";

import { subscribeToNewsletter } from "../apis/newsletter.api";
import type { SubscribeResult } from "../types/newsletter";

export async function subscribeAction(email: string): Promise<SubscribeResult> {
  try {
    return await subscribeToNewsletter(email);
  } catch {
    return "error"; // 500s, network, anything else
  }
}
