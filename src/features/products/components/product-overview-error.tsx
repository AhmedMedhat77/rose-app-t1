"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";

interface ProductOverviewErrorProps {
  error: unknown;
  retry: () => void;
}

export function ProductOverviewError({
  error,
  retry,
}: ProductOverviewErrorProps) {
  // Translation
  const t = useTranslations("Product");

  // Effects
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="container mx-auto flex flex-col items-center gap-4 px-4 py-16 text-center"
    >
      <p className="text-text-muted">{t("loadError")}</p>
      <Button onClick={retry}>{t("retry")}</Button>
    </div>
  );
}
