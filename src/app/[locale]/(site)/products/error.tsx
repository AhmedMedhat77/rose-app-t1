"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";

type ProductsErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ProductsError({ error, retry }: ProductsErrorProps) {
  const t = useTranslations("Product");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      role="alert"
      className="mt-17 mb-10 flex min-h-80 flex-col items-center justify-center gap-4"
    >
      <p className="text-text-primary text-lg">{t("loadError")}</p>
      <Button onClick={retry}>{t("retry")}</Button>
    </section>
  );
}
