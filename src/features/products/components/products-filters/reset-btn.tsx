"use client";

import { Button } from "@/shared/ui/button";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { useFilterUrl } from "../../hooks/use-filter-url";
import { ALL_FILTER_KEYS } from "../../lib/constants/filters.const";

export default function ResetBtn() {
  const t = useTranslations();
  const { searchParams, update } = useFilterUrl();

  const isAnyActive = ALL_FILTER_KEYS.some((key) => searchParams.has(key));

  return (
    <div className="w-full py-4">
      <Button
        variant="secondary"
        type="button"
        className="w-full"
        disabled={!isAnyActive}
        onClick={() =>
          update((p) => ALL_FILTER_KEYS.forEach((k) => p.delete(k)))
        }
      >
        <RotateCcw /> {t("productFilter.filtersResetAll")}
      </Button>
    </div>
  );
}
