import "server-only";

import type { Coupon } from "@/features/summary/lib/types/coupon";
import { apiFetch } from "@/shared/lib/apis/fetch.api";
import type { IPaginatedPayload } from "@/shared/types/api";

export async function getCoupons(query: {
  page: number;
  limit: number;
  search: string;
}): Promise<Coupon[]> {
  const result = await apiFetch<IPaginatedPayload<Coupon>>("/coupons", {
    query,
    cache: "no-store",
  });

  return result.payload.data;
}
