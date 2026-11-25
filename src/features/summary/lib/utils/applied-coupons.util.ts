import type { Coupon } from "@/features/summary/lib/types/coupon";

const COUPONS_STORAGE_KEY = "rose-applied-coupons";
const COUPONS_OWNER_KEY = "rose-applied-coupons-owner";

// useSyncExternalStore requires the same snapshot reference until storage changes.
const EMPTY_APPLIED_COUPONS: Coupon[] = [];

let cachedRaw: string | null | undefined;
let cachedSnapshot: Coupon[] = EMPTY_APPLIED_COUPONS;

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function isStoredCoupon(item: unknown): item is Coupon {
  if (typeof item !== "object" || item === null) {
    return false;
  }

  const coupon = item as { id?: unknown; code?: unknown };

  return typeof coupon.id === "string" && typeof coupon.code === "string";
}

function readAppliedCoupons(): Coupon[] {
  if (typeof window === "undefined") {
    return EMPTY_APPLIED_COUPONS;
  }

  const raw = localStorage.getItem(COUPONS_STORAGE_KEY);

  if (raw === cachedRaw) {
    return cachedSnapshot;
  }

  cachedRaw = raw;

  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      cachedSnapshot = EMPTY_APPLIED_COUPONS;
      return cachedSnapshot;
    }

    cachedSnapshot = parsed.filter(isStoredCoupon);

    return cachedSnapshot;
  } catch {
    cachedSnapshot = EMPTY_APPLIED_COUPONS;
    return cachedSnapshot;
  }
}

function saveAppliedCoupons(coupons: Coupon[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));

  cachedRaw = undefined;
  readAppliedCoupons();

  notifyListeners();
}

function handleStorage(event: StorageEvent) {
  if (event.key === COUPONS_STORAGE_KEY || event.key === null) {
    cachedRaw = undefined;
    notifyListeners();
  }
}

export function subscribeAppliedCoupons(listener: () => void) {
  listeners.add(listener);

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(listener);

    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function getAppliedCouponsSnapshot(): Coupon[] {
  return readAppliedCoupons();
}

export function getAppliedCouponsServerSnapshot(): Coupon[] {
  return EMPTY_APPLIED_COUPONS;
}

export function addAppliedCoupon(coupon: Coupon) {
  const coupons = readAppliedCoupons();

  if (coupons.some((applied) => applied.id === coupon.id)) {
    return;
  }

  saveAppliedCoupons([...coupons, coupon]);
}

export function removeAppliedCoupon(couponId: string) {
  const coupons = readAppliedCoupons();

  saveAppliedCoupons(coupons.filter((coupon) => coupon.id !== couponId));
}

export function clearAppliedCoupons() {
  saveAppliedCoupons([]);
  clearAppliedCouponsOwner();
}

export function getAppliedCouponsOwner(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(COUPONS_OWNER_KEY);
}

export function setAppliedCouponsOwner(userId: string) {
  if (typeof window === "undefined") return;

  localStorage.setItem(COUPONS_OWNER_KEY, userId);
}

export function clearAppliedCouponsOwner() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(COUPONS_OWNER_KEY);
}
