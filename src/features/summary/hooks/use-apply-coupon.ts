"use client";

import { useMutation } from "@tanstack/react-query";

import { findCouponByCodeAction } from "../lib/actions/find-coupon.action";
import type { ApplyCouponResult } from "../lib/types/apply-coupon.types";

export function useApplyCoupon() {
  // Mutation
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (code: string) => findCouponByCodeAction(code),
    onError: () => {
      // applyCoupon returns { ok: false } so the form can show the message.
    },
  });

  async function applyCoupon(code: string): Promise<ApplyCouponResult> {
    try {
      const result = await mutateAsync(code);
      return { ok: true, coupon: result.coupon };
    } catch {
      return { ok: false };
    }
  }

  return { isPending, applyCoupon };
}
