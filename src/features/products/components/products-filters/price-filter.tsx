"use client";

import { Input } from "@/shared/ui/input";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePriceFilter } from "../../hooks/use-price-filter";

export default function PriceFilter() {
  const t = useTranslations();
  const { from, to, setFrom, setTo, reset, isActive, isInvalid } =
    usePriceFilter();

  return (
    <div className="border-border-subtle border-b">
      {/* Heading */}
      <div className="flex justify-between py-2.5">
        <h3 className="text-text-plain text-lg leading-none font-semibold">
          {t("productFilter.filtersPrice")}
        </h3>

        {isActive && (
          <button
            type="button"
            onClick={reset}
            className="text-text-danger flex items-center gap-1 text-sm"
          >
            <X className="h-3.75 w-3.75" />
            {t("productFilter.filtersReset")}
          </button>
        )}
      </div>

      {/* Price Range Inputs */}
      <div className="grid grid-cols-2 gap-2 pb-5">
        <div>
          <span className="text-text-plain text-sm font-medium">
            {t("productFilter.filtersPriceFrom")}
          </span>
          <Input
            className="w-33.75"
            type="number"
            min={0}
            value={from}
            aria-invalid={isInvalid}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <span className="text-text-plain text-sm font-medium">
            {t("productFilter.filtersPriceTo")}
          </span>
          <Input
            className="w-33.75"
            type="number"
            min={0}
            value={to}
            aria-invalid={isInvalid}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
