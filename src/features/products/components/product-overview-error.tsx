"use client";

import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";

import { PRODUCT_QUERY_KEYS } from "../lib/constants/product.constants";

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

  // Query
  const queryClient = useQueryClient();

  // Effects
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Handlers
  const handleRetry = () => {
    // Clear cached error so the query refetches instead of rethrowing
    queryClient.resetQueries({ queryKey: PRODUCT_QUERY_KEYS.products() });
    retry();
  };

  return (
    <div
      role="alert"
      className="container mx-auto flex flex-col items-center gap-4 px-4 py-16 text-center"
    >
      <p className="text-text-muted">{t("loadError")}</p>
      <Button onClick={handleRetry}>{t("retry")}</Button>
    </div>
  );
}
