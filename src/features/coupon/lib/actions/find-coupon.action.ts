"use server";

import { getCoupons } from "@/features/coupon/lib/apis/coupons.api";

export async function findCouponByCodeAction(code: string) {
  const coupons = await getCoupons(`/coupons?search=${code}`);
  return coupons.find((coupon) => coupon.code === code);
}
