import { getDiscount } from "@/shared/lib/utils/price";

import type { Coupon } from "@/features/summary/lib/types/coupon";

export type CouponApplyError =
  "not-found" | "already-applied" | "inactive" | "expired" | "below-minimum";

function isCouponValid(coupon: Coupon, now: number) {
  const validUntil = new Date(coupon.validUntil).getTime();
  const validFrom = new Date(coupon.validFrom).getTime();

  const withinUsageLimit =
    coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit;

  const withinDateRange = now >= validFrom && now <= validUntil;

  return withinUsageLimit && withinDateRange;
}

export function getCouponApplyError({
  coupon,
  appliedCoupons,
  subtotal,
  now = Date.now(),
}: {
  coupon: Coupon | null;
  appliedCoupons: Coupon[];
  subtotal: number;
  now?: number;
}): CouponApplyError | null {
  if (!coupon) return "not-found";

  const isAlreadyApplied = appliedCoupons.some(
    (applied) => applied.id === coupon.id,
  );
  if (isAlreadyApplied) return "already-applied";
  if (!coupon.isActive) return "inactive";
  if (!isCouponValid(coupon, now)) return "expired";
  if (subtotal < Number(coupon.minPurchase)) return "below-minimum";

  return null;
}

const roundMoney = (value: number) => Math.round(value * 100) / 100;

export function getCouponsDiscount(coupons: Coupon[], subtotal: number) {
  const { discount } = coupons.reduce(
    (result, coupon) => {
      const amount = getDiscount({
        price: result.remaining,
        discountType: coupon.type,
        discountValue: Number(coupon.value),
      });
      const cappedDiscount =
        coupon.type === "PERCENT" && coupon.maxDiscount !== null
          ? Math.min(amount, Number(coupon.maxDiscount))
          : amount;
      const couponDiscount = Math.min(cappedDiscount, result.remaining);

      return {
        discount: result.discount + couponDiscount,
        remaining: roundMoney(result.remaining - couponDiscount),
      };
    },
    { discount: 0, remaining: subtotal },
  );

  return roundMoney(Math.min(discount, subtotal));
}
