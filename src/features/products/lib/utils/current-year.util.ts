import { cacheLife } from "next/cache";

export async function getCurrentYear(locale: string) {
  "use cache";
  cacheLife("days");

  const numberingSystem = locale === "ar" ? "arab" : "latn";

  return new Intl.NumberFormat(locale, {
    useGrouping: false,
    numberingSystem,
  }).format(new Date().getFullYear());
}
