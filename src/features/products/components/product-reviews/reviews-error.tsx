"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";

export default function ReviewsError() {
  const t = useTranslations("productReview");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <p className="text-text-plain text-base font-medium">{t("loadError")}</p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="text-text-plain text-sm font-semibold underline"
      >
        {t("retry")}
      </button>
    </div>
  );
}
