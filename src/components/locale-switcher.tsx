"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeNames = { en: "English", ar: "العربية" };

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations();

  const otherLocales = routing.locales.filter((l) => l !== locale);

  return (
    <nav aria-label={t("language")} className="flex gap-3 p-4">
      {otherLocales.map((nextLocale) => (
        <Link
          key={nextLocale}
          href={pathname}
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
