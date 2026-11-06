"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";

export function AuthLocaleToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const targetLocale = locale === "en" ? "ar" : "en";
  const label = locale === "en" ? "العربية" : "English";

  // نحافظ على ?email=...&step=... وإلا الـ flow يرجع لأول خطوة
  const query = searchParams.toString();
  const href = query ? `${pathname}?${query}` : pathname;

  return (
    <Link
      href={href}
      locale={targetLocale}
      lang={targetLocale}
      className={`text-zinc-600 transition-colors hover:opacity-85 dark:text-zinc-400 ${
        targetLocale === "ar" ? "font-arabic" : "font-english"
      }`}
    >
      {label}
    </Link>
  );
}
