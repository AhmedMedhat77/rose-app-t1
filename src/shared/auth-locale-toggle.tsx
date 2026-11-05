"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthLocaleToggleLink({ query = "" }: { query?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const targetLocale = locale === "en" ? "ar" : "en";
  const label = locale === "en" ? "العربية" : "English";

  return (
    <Link
      href={{
        pathname,
        query: Object.fromEntries(new URLSearchParams(query).entries()),
      }}
      locale={targetLocale}
      className={`text-zinc600 dark:text-zinc-90 transition-colors hover:opacity-85 ${
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
