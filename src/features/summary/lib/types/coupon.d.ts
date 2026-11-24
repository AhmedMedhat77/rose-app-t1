export type Coupon = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: string;
  minPurchase: string;
  maxDiscount: string | null;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FindCouponByCodeResult = { coupon: Coupon } | { coupon: null };
