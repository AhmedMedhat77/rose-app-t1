"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";

export function ProfileLoadError() {
  // Translation
  const t = useTranslations("accountSettings.Profile");

  // Navigation
  const router = useRouter();

  // Functions
  function handleRetry() {
    router.refresh();
  }

  return (
    <div className="flex min-h-[32rem] flex-col items-start justify-center gap-3">
      <h2 className="text-text-plain text-lg font-semibold">
        {t("loadError.title")}
      </h2>
      <p className="text-text-soft text-sm">{t("loadError.description")}</p>
      <Button type="button" onClick={handleRetry}>
        {t("loadError.retry")}
      </Button>
    </div>
  );
}
