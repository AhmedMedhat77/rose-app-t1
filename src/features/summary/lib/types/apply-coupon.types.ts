import type { z } from "zod";

import type { createApplyCouponSchema } from "../schemas/apply-coupon.schema";
import type { Coupon } from "./coupon";

export type ApplyCouponFormValues = z.infer<
  ReturnType<typeof createApplyCouponSchema>
>;

export type ApplyCouponResult =
  { ok: true; coupon: Coupon | null } | { ok: false };
