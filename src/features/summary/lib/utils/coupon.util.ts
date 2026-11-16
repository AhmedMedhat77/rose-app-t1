import type { ICoupon } from "@/features/summary/lib/types/coupon";

export type CouponApplyError =
  "not-found" | "already-applied" | "inactive" | "below-minimum";

const roundMoney = (value: number) => Math.round(value * 100) / 100;

export function getCouponApplyError({
  coupon,
  appliedCoupons,
  subtotal,
}: {
  coupon: ICoupon | null;
  appliedCoupons: ICoupon[];
  subtotal: number;
}): CouponApplyError | null {
  if (!coupon) return "not-found";

  const isAlreadyApplied = appliedCoupons.some(
    (applied) => applied.id === coupon.id,
  );
  if (isAlreadyApplied) return "already-applied";
  if (!coupon.isActive) return "inactive";
  if (subtotal < Number(coupon.minPurchase)) return "below-minimum";

  return null;
}

export function getCouponDiscount(coupon: ICoupon, subtotal: number) {
  const percentDiscount = subtotal * (Number(coupon.value) / 100);
  const maxDiscount = subtotal * (Number(coupon.maxDiscount) / 100);
  return roundMoney(Math.min(percentDiscount, maxDiscount));
}

export function getCouponsDiscount(coupons: ICoupon[], subtotal: number) {
  const { discount } = coupons.reduce(
    (result, coupon) => {
      const couponDiscount = Math.min(
        getCouponDiscount(coupon, result.remaining),
        result.remaining,
      );

      return {
        discount: result.discount + couponDiscount,
        remaining: roundMoney(result.remaining - couponDiscount),
      };
    },
    { discount: 0, remaining: subtotal },
  );

  return roundMoney(Math.min(discount, subtotal));
}
