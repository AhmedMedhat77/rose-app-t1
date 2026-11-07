"use client";

import { useLocale } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Suspense } from "react";

function AuthLocaleToggleLink({ query = "" }: { query?: string }) {
  const locale = useLocale();
  const pathname = usePathname();

  const targetLocale = locale === "en" ? "ar" : "en";
  const label = locale === "en" ? "العربية" : "English";

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

function AuthLocaleToggleWithQuery() {
  const searchParams = useSearchParams();

  return <AuthLocaleToggleLink query={searchParams.toString()} />;
}

export function AuthLocaleToggle() {
  return (
    <Suspense fallback={<AuthLocaleToggleLink />}>
      <AuthLocaleToggleWithQuery />
    </Suspense>
  );
}
