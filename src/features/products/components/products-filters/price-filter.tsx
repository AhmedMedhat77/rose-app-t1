"use client";

import { useId } from "react";
import { Input } from "@/shared/ui/input";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePriceFilter } from "../../hooks/use-price-filter";

export default function PriceFilter() {
  // Translation
  const t = useTranslations();

  // Hooks
  const { min, max, setField, onBlur, reset, isActive, errorField } =
    usePriceFilter();

  // Variables
  const errorId = useId();

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
            className={`text w-33.75 shadow-none ${min === "0" ? "text-zinc-400" : "text-zinc-900"}`}
            type="text"
            inputMode="numeric"
            value={min}
            onChange={(e) => setField("min", e.target.value)}
            onBlur={() => onBlur("min")}
            aria-invalid={errorField === "min"}
            aria-describedby={errorField === "min" ? errorId : undefined}
          />
        </label>
        {/*input to */}
        <label className="block">
          <span className="text-text-plain text-sm font-medium">
            {t("productFilter.filtersPriceTo")}
          </span>
          <Input
            className={`w-33.75 shadow-none ${max === "1000000" ? "text-zinc-400" : "text-zinc-900"}`}
            type="text"
            inputMode="numeric"
            value={max}
            onChange={(e) => setField("max", e.target.value)}
            onBlur={() => onBlur("max")}
            aria-invalid={errorField === "max"}
            aria-describedby={errorField === "max" ? errorId : undefined}
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
