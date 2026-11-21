import type { z } from "zod";

import type { createApplyCouponSchema } from "../schemas/apply-coupon.schema";

export type ApplyCouponFormValues = z.infer<
  ReturnType<typeof createApplyCouponSchema>
>;
