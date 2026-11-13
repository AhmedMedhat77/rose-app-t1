"use client";

import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export default function RegisterSuccess() {
  const t = useTranslations("RegisterSuccess");

  return (
    <div role="status" className="flex flex-col items-center gap-6 text-center">
      <CircleCheck aria-hidden="true" className="text-text-primary size-16" />

      <div className="space-y-2">
        <h2 className="text-text-plain text-3xl font-bold">{t("title")}</h2>
        <p className="text-text-soft text-sm">{t("description")}</p>
      </div>

      <Link
        href="/login"
        className="bg-bg-primary text-text-inverse hover:bg-bg-primary-saturated focus-visible:ring-ring-default inline-flex h-12 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-3"
      >
        {t("login")}
      </Link>
    </div>
  );
}
