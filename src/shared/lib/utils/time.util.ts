import { cacheLife } from "next/cache";

const NEW_PRODUCT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function isNewProduct(createdAt: string, now = Date.now()) {
  return now - new Date(createdAt).getTime() < NEW_PRODUCT_WINDOW_MS;
}

export async function getCurrentYear(locale: string) {
  "use cache";
  cacheLife("days");

  const numberingSystem = locale === "ar" ? "arab" : "latn";

  return new Intl.NumberFormat(locale, {
    useGrouping: false,
    numberingSystem,
  }).format(new Date().getFullYear());
}
