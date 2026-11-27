export const FILTER_KEYS = {
  CATEGORY: "category",
  OCCASION: "occasion",
  RATING: "rating",
  MIN_PRICE: "minPrice",
  MAX_PRICE: "maxPrice",
} as const;

export const ALL_FILTER_KEYS = Object.values(FILTER_KEYS);

export const PAGE_KEY = "page";

export const PRICE_DEFAULTS = { MIN: "0", MAX: "1000000" } as const;
