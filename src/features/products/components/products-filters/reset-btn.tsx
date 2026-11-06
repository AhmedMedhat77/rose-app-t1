"use client";

import { Button } from "@/shared/ui/button";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { usePathname, useRouter } from "@/i18n/navigation";

const FILTER_KEYS = ["category", "occasion", "rating", "minPrice", "maxPrice"];

export default function ResetBtn() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter isActive
  const isAnyActive = FILTER_KEYS.some((key) => searchParams.has(key));
  // function handleRestAll
  const handleResetAll = () => {
    const params = new URLSearchParams(searchParams.toString());

    FILTER_KEYS.forEach((key) => params.delete(key));

    router.replace(params.size ? `${pathname}?${params}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className="w-full py-4">
      <Button
        variant="secondary"
        type="button"
        className="w-full"
        disabled={!isAnyActive}
        onClick={handleResetAll}
      >
        <RotateCcw /> {t("productFilter.filtersResetAll")}
      </Button>
    </div>
  );
}
