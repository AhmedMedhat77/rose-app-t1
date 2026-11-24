"use server";

import { getCoupons } from "@/features/summary/lib/apis/coupons.api";
import type { FindCouponByCodeResult } from "@/features/summary/lib/types/coupon";

const COUPON_SEARCH_PAGE = "1";
const COUPON_SEARCH_LIMIT = "20";

export async function findCouponByCodeAction(
  code: string,
): Promise<FindCouponByCodeResult> {
  const searchParams = new URLSearchParams({
    page: COUPON_SEARCH_PAGE,
    limit: COUPON_SEARCH_LIMIT,
    search: code.trim(),
  });

  const coupons = await getCoupons(`/coupons?${searchParams.toString()}`);
  const normalizedCode = code.trim().toLowerCase();
  const coupon = coupons.find(
    (item) => item.code.trim().toLowerCase() === normalizedCode,
  );

  return { coupon: coupon ?? null };
}
