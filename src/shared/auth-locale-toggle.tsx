"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export function AuthLocaleToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const targetLocale = locale === "en" ? "ar" : "en";
  const label = locale === "en" ? "العربية" : "English";

  return (
    <Link
      href={pathname}
      locale={targetLocale}
      className={`text-sm text-zinc-300 transition-colors hover:text-white ${
        targetLocale === "ar" ? "font-arabic" : "font-english"
      }`}
    >
      {label}
    </Link>
  );
}
