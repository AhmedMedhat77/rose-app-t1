import { GUEST_WISHLIST_STORAGE_KEY } from "../constants/wishlist-constants";

const EMPTY_IDS: string[] = [];
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedIds: string[] = EMPTY_IDS;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(GUEST_WISHLIST_STORAGE_KEY);
  } catch {
    return null;
  }
}

function parseIds(raw: string | null): string[] {
  if (!raw) return EMPTY_IDS;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_IDS;
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return EMPTY_IDS;
  }
}

function writeIds(ids: string[]) {
  try {
    window.localStorage.setItem(
      GUEST_WISHLIST_STORAGE_KEY,
      JSON.stringify(ids),
    );
  } catch {}
  listeners.forEach((listener) => listener());
}

export function getGuestWishlistSnapshot(): string[] {
  const raw = readRaw();

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedIds = parseIds(raw);
  }

  return cachedIds;
}

export function getGuestWishlistServerSnapshot(): string[] {
  return EMPTY_IDS;
}

export function subscribeToGuestWishlist(listener: () => void) {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === GUEST_WISHLIST_STORAGE_KEY || event.key === null) {
      listener();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function toggleGuestWishlistItem(productId: string) {
  const ids = getGuestWishlistSnapshot();

  writeIds(
    ids.includes(productId)
      ? ids.filter((id) => id !== productId)
      : [...ids, productId],
  );
}

export function clearGuestWishlist() {
  writeIds([]);
}

export function removeGuestWishlistItems(productIds: string[]) {
  if (productIds.length === 0) return;

  writeIds(getGuestWishlistSnapshot().filter((id) => !productIds.includes(id)));
}
