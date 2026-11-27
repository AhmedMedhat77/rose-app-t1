import type { ICartProduct, IGuestCartItem } from "../types/cart.types";

const CART_STORAGE_KEY = "rose-guest-cart";
const CART_OWNER_KEY = "rose-guest-cart-owner";

// useSyncExternalStore requires the same snapshot reference until storage changes.
const EMPTY_GUEST_CART: IGuestCartItem[] = [];

let cachedRaw: string | null | undefined;
let cachedSnapshot: IGuestCartItem[] = EMPTY_GUEST_CART;

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function readCart(): IGuestCartItem[] {
  if (typeof window === "undefined") {
    return EMPTY_GUEST_CART;
  }

  const raw = localStorage.getItem(CART_STORAGE_KEY);

  if (raw === cachedRaw) {
    return cachedSnapshot;
  }

  cachedRaw = raw;

  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      cachedSnapshot = EMPTY_GUEST_CART;
      return cachedSnapshot;
    }

    cachedSnapshot = parsed.filter(
      (item): item is IGuestCartItem =>
        typeof item?.productId === "string" &&
        typeof item?.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        typeof item?.product === "object" &&
        item.product !== null &&
        item.product.id === item.productId &&
        typeof item.product.stock === "number" &&
        Number.isFinite(item.product.stock) &&
        item.product.stock >= 0,
    );

    return cachedSnapshot;
  } catch {
    cachedSnapshot = EMPTY_GUEST_CART;
    return cachedSnapshot;
  }
}

function saveCart(items: IGuestCartItem[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));

  cachedRaw = undefined;
  readCart();

  notifyListeners();
}

export function subscribeGuestCart(listener: () => void) {
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
// Storage events only fire in other tabs; local writes notify listeners in saveCart.
function handleStorage(event: StorageEvent) {
  if (event.key === CART_STORAGE_KEY || event.key === null) {
    cachedRaw = undefined;
    notifyListeners();
  }
}

export function getGuestCartSnapshot(): IGuestCartItem[] {
  return readCart();
}

export function getGuestCartServerSnapshot(): IGuestCartItem[] {
  return EMPTY_GUEST_CART;
}

export function addGuestCartItem(product: ICartProduct, quantity: number) {
  if (quantity <= 0 || product.stock <= 0) return;

  const cart = readCart();

  const existingItem = cart.find((item) => item.productId === product.id);

  if (existingItem) {
    saveCart(
      cart.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              product,
              quantity: Math.min(item.quantity + quantity, product.stock),
            }
          : item,
      ),
    );

    return;
  }

  saveCart([
    ...cart,
    {
      productId: product.id,
      quantity: Math.min(quantity, product.stock),
      product,
    },
  ]);
}
export function updateGuestCartItem(productId: string, quantity: number) {
  const cart = readCart();

  if (quantity <= 0) {
    removeGuestCartItem(productId);
    return;
  }

  saveCart(
    cart.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(quantity, item.product.stock),
          }
        : item,
    ),
  );
}
export function removeGuestCartItem(productId: string) {
  const cart = readCart();

  saveCart(cart.filter((item) => item.productId !== productId));
}

export function clearGuestCart() {
  saveCart([]);
  clearGuestCartOwner();
}

export function getGuestCartOwner(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(CART_OWNER_KEY);
}

export function setGuestCartOwner(userId: string) {
  if (typeof window === "undefined") return;

  localStorage.setItem(CART_OWNER_KEY, userId);
}

export function clearGuestCartOwner() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(CART_OWNER_KEY);
}
