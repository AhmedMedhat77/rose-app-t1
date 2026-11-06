import { Button } from "@/shared/ui/button";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function ResetBtn() {
  const t = useTranslations();
  return (
    <div className="w-full py-4">
      <Button variant="secondary" type="button" className="w-full">
        <RotateCcw /> {t("productFilter.filtersResetAll")}
      </Button>
    </div>
  );
}
