"use client";

import { useMutation } from "@tanstack/react-query";

import { findCouponByCodeAction } from "../lib/actions/find-coupon.action";

export function useApplyCoupon() {
  // Mutation
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (code: string) => findCouponByCodeAction(code),
    onError: () => {
      // The form maps this rejection to the coupon field.
    },
  });

  return { isPending, applyCoupon: mutateAsync };
}
