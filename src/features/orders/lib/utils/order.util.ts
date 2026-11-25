import {
  ORDERS_MAX_LIMIT,
  ORDERS_PAGE_SIZE,
} from "../constants/orders-pagination.constant";

// The API has no human-friendly order number, so show the id's first segment.
export function getOrderNumber(orderId: string) {
  return orderId.split("-")[0].toUpperCase();
}

function parsePositiveInt(value: string | string[] | undefined) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : null;
}

// Reads `page` and `limit` from the URL. Invalid values fall back to defaults.
export function getOrdersPagination(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const page = parsePositiveInt(searchParams.page) ?? 1;
  const limit = Math.min(
    parsePositiveInt(searchParams.limit) ?? ORDERS_PAGE_SIZE,
    ORDERS_MAX_LIMIT,
  );

  return { page, limit };
}
