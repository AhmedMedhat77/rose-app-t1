"use client";

import { useId } from "react";
import { Input } from "@/shared/ui/input";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePriceFilter } from "../../hooks/use-price-filter";

export default function PriceFilter() {
  const t = useTranslations();
  const errorId = useId();
  const {
    from,
    to,
    setFrom,
    setTo,
    onBlurFrom,
    onBlurTo,
    reset,
    isActive,
    errorField,
  } = usePriceFilter();

  return (
    <div className="border-border-subtle border-b">
      <div className="flex justify-between py-2.5">
        <h3 className="text-text-plain text-lg leading-none font-semibold">
          {t("productFilter.filtersPrice")}
        </h3>
        {/* reset btn */}
        {isActive && (
          <button
            type="button"
            onClick={reset}
            aria-label={t("productFilter.filtersReset")}
            className="text-text-danger flex items-center gap-1 text-sm"
          >
            <X className="h-3.75 w-3.75" aria-hidden />
            {t("productFilter.filtersReset")}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pb-2">
        {/*input from */}
        <label className="block">
          <span className="text-text-plain text-sm font-medium">
            {t("productFilter.filtersPriceFrom")}
          </span>
          <Input
            className="w-33.75"
            type="text"
            inputMode="numeric"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            onBlur={onBlurFrom}
            aria-invalid={errorField === "from"}
            aria-describedby={errorField === "from" ? errorId : undefined}
          />
        </label>
        {/*input to */}
        <label className="block">
          <span className="text-text-plain text-sm font-medium">
            {t("productFilter.filtersPriceTo")}
          </span>
          <Input
            className="w-33.75"
            type="text"
            inputMode="numeric"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onBlur={onBlurTo}
            aria-invalid={errorField === "to"}
            aria-describedby={errorField === "to" ? errorId : undefined}
          />
        </label>
      </div>
      {/*message error */}
      <div className="min-h-5 pb-3">
        {errorField && (
          <p id={errorId} role="alert" className="text-text-danger text-xs">
            {t("productFilter.filtersPriceError")}
          </p>
        )}
      </div>
    </div>
  );
}
