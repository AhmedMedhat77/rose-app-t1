"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { useSession } from "next-auth/react";

import type { Coupon } from "../lib/types/coupon";
import {
  addAppliedCoupon as addStoredCoupon,
  clearAppliedCoupons,
  getAppliedCouponsOwner,
  getAppliedCouponsServerSnapshot,
  getAppliedCouponsSnapshot,
  removeAppliedCoupon,
  setAppliedCouponsOwner,
  subscribeAppliedCoupons,
} from "../lib/utils/applied-coupons.util";

interface CouponContextValue {
  appliedCoupons: Coupon[];
  addAppliedCoupon: (coupon: Coupon) => void;
  removeAppliedCoupon: (couponId: string) => void;
}

const CouponContext = createContext<CouponContextValue | undefined>(undefined);

export function CouponProvider({ children }: { children: ReactNode }) {
  // Hooks
  const { data: session, status } = useSession();
  const appliedCoupons = useSyncExternalStore(
    subscribeAppliedCoupons,
    getAppliedCouponsSnapshot,
    getAppliedCouponsServerSnapshot,
  );

  // Variables
  const userId = session?.user?.id;

  // Functions
  const addAppliedCoupon = useCallback(
    (coupon: Coupon) => {
      addStoredCoupon(coupon);

      if (status === "authenticated" && userId) {
        setAppliedCouponsOwner(userId);
      }
    },
    [status, userId],
  );

  // Effects
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && userId) {
      const owner = getAppliedCouponsOwner();

      if (owner && owner !== userId) {
        clearAppliedCoupons();
        return;
      }

      if (!owner && getAppliedCouponsSnapshot().length > 0) {
        setAppliedCouponsOwner(userId);
      }

      return;
    }

    if (status === "unauthenticated" && getAppliedCouponsOwner()) {
      clearAppliedCoupons();
    }
  }, [status, userId]);

  const value: CouponContextValue = {
    appliedCoupons,
    addAppliedCoupon,
    removeAppliedCoupon,
  };

  return (
    <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
  );
}

export function useCouponContext() {
  const context = useContext(CouponContext);

  if (!context) {
    throw new Error("useCouponContext must be used within CouponProvider.");
  }

  return context;
}
