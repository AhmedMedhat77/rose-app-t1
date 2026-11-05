"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import FormDivider from "./shared/form-divider";

export default function ResetPasswordSent({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
  const t = useTranslations("ResetPasswordSent");

  return (
    <div className="w-full space-y-6 text-zinc-800 dark:text-zinc-50">
      {/* Title row with back button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label={t("back")}
          className="bg-primary flex size-9 items-center justify-center rounded-md text-white transition-opacity hover:opacity-90"
        >
          <ChevronLeft className="rtl:-scale-x-100" />
        </button>
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
      </div>

      {/* Sent-to email */}
      <div className="space-y-1">
        <p className="text-lg">{t("sentTo")}</p>
        {email ? (
          <p className="text-primary font-medium break-all">{email}</p>
        ) : null}
      </div>

      <FormDivider />

      {/* Instructions */}
      <p className="leading-relaxed">{t("accountExists")}</p>
      <p className="leading-relaxed text-zinc-500 dark:text-zinc-400">
        {t("checkSpam")}
      </p>

      <FormDivider />

      {/* Help */}
      <p className="text-center text-sm font-medium">
        {t("needHelp")}{" "}
        <Link
          href="/contact-us"
          className="text-primary font-bold hover:underline"
        >
          {t("contactUs")}
        </Link>
      </p>
    </div>
  );
}
