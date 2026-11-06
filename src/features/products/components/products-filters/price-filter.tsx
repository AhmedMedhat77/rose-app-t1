import { Input } from "@/shared/ui/input";
import { X } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

export default function PriceFilter() {
  const t = useTranslations();
  return (
    <div className="border-border-subtle border-b">
      {/*heading*/}
      <div className="flex justify-between py-2.5">
        <h3 className="text-text-plain text-lg leading-none font-semibold tracking-normal">
          {t("productFilter.filtersPrice")}
        </h3>
        <button
          type="button"
          className="text-text-danger flex items-center gap-1 text-sm"
        >
          <X className="h-3.75 w-3.75" />
          {t("productFilter.filtersReset")}
        </button>
      </div>
      {/*Price Range*/}
      <div className="grid grid-cols-2 gap-2 pb-5">
        <div>
          <span className="text-text-plain text-sm font-medium">
            {t("productFilter.filtersPriceFrom")}
          </span>
          <Input className="w-33.75" type="text" />
        </div>
        <div>
          <span className="text-text-plain text-sm font-medium">
            {t("productFilter.filtersPriceTo")}
          </span>
          <Input className="w-33.75" type="text" />
        </div>
      </div>
    </div>
  );
}
