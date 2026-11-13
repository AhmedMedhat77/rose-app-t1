import type { IGuestCartItem } from "../types/cart.types";

const GUEST_CART_KEY = "rose-guest-cart";
const GUEST_CART_OWNER_KEY = "rose-guest-cart-owner";

const EMPTY_CART: IGuestCartItem[] = [];

let cachedRaw: string | null | undefined;
let cachedCart: IGuestCartItem[] = EMPTY_CART;

const listeners = new Set<() => void>();

function notifyCartChange() {
  listeners.forEach((listener) => listener());
  window.dispatchEvent(new Event("rose-cart-change"));
}

function parseCart(raw: string | null): IGuestCartItem[] {
  if (!raw) return EMPTY_CART;

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) return EMPTY_CART;

    return parsed.filter(
      (item): item is IGuestCartItem =>
        typeof item?.productId === "string" &&
        typeof item?.quantity === "number" &&
        item.quantity > 0,
    );
  } catch {
    return EMPTY_CART;
  }
}

// Used by useSyncExternalStore.
export function subscribeGuestCart(callback: () => void) {
  listeners.add(callback);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === GUEST_CART_KEY) callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener("rose-cart-change", callback);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("rose-cart-change", callback);
  };
}

// Client snapshot.
export function getGuestCartSnapshot(): IGuestCartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;

  const raw = localStorage.getItem(GUEST_CART_KEY);

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedCart = parseCart(raw);
  }

  return cachedCart;
}

// Server snapshot: always empty during SSR and hydration.
export function getGuestCartServerSnapshot(): IGuestCartItem[] {
  return EMPTY_CART;
}

export function getGuestCart(): IGuestCartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;

  return getGuestCartSnapshot();
}

export function saveGuestCart(cart: IGuestCartItem[]) {
  if (typeof window === "undefined") return;

  const raw = JSON.stringify(cart);

  localStorage.setItem(GUEST_CART_KEY, raw);

  // Update the cached snapshot before notifying subscribers.
  cachedRaw = raw;
  cachedCart = cart;

  notifyCartChange();
}

export function addGuestCartItem(productId: string, quantity: number) {
  const cart = getGuestCart();
  const existingItem = cart.find((item) => item.productId === productId);

  const updatedCart = existingItem
    ? cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      )
    : [...cart, { productId, quantity }];

  saveGuestCart(updatedCart);
}

export function removeGuestCartItem(productId: string) {
  const updatedCart = getGuestCart().filter(
    (item) => item.productId !== productId,
  );

  saveGuestCart(updatedCart);
}

export function clearGuestCart() {
  saveGuestCart([]);
}

export function getGuestCartOwner(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(GUEST_CART_OWNER_KEY);
}

export function setGuestCartOwner(userId: string) {
  if (typeof window === "undefined") return;

  localStorage.setItem(GUEST_CART_OWNER_KEY, userId);
}

export function clearGuestCartOwner() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(GUEST_CART_OWNER_KEY);
}
