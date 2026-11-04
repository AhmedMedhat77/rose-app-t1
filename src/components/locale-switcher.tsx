"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeNames = { en: "English", ar: "العربية" };

/** Language links for the current path. `query` is kept so `page` and `limit` survive a locale change. */
function LocaleSwitcherLinks({ query }: { query: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations();
  const params = new URLSearchParams(query);
  const search = Object.fromEntries(params.entries());

  const otherLocales = routing.locales.filter((l) => l !== locale);

  return (
    <nav aria-label={t("language")} className="flex gap-3 p-4">
      {otherLocales.map((nextLocale) => (
        <Link
          key={nextLocale}
          href={query ? { pathname, query: search } : pathname}
          locale={nextLocale}
          lang={nextLocale}
          dir={nextLocale === "ar" ? "rtl" : "ltr"}
          className={`text-primary focus-visible:outline-ring rounded-sm px-2 py-1 underline-offset-4 hover:underline focus-visible:outline-2 ${nextLocale === "ar" ? "font-arabic" : "font-english"}`}
        >
          {localeNames[nextLocale]}
        </Link>
      ))}
    </nav>
  );
}

/** Reads the URL search string. Must render under Suspense or static rendering bails out. */
function LocaleSwitcherWithQuery() {
  const searchParams = useSearchParams();
  return <LocaleSwitcherLinks query={searchParams.toString()} />;
}

/** Locale links. The fallback omits the query until `useSearchParams` resolves. */
export function LocaleSwitcher() {
  return (
    <Suspense fallback={<LocaleSwitcherLinks query="" />}>
      <LocaleSwitcherWithQuery />
    </Suspense>
  );
}
