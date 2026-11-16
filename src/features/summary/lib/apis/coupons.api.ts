import "server-only";

import { API_URL } from "@/app/shared/constants/config";
import type { ICoupon } from "@/features/summary/lib/types/coupon";
import type { IPaginatedResponse } from "@/shared/types/api";

export async function getCoupons(url: string): Promise<ICoupon[]> {
  if (!API_URL) throw new Error("API_URL is not configured");

  const response = await fetch(`${API_URL}${url}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const body: IPaginatedResponse<ICoupon> = await response.json();
  if (!response.ok || !body.status) {
    throw new Error("Failed to fetch coupons");
  }

  return body.payload.data;
}
