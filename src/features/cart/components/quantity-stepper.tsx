"use client";

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type Props = {
  value: number;
  max: number;
  min?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export default function QuantityStepper({
  value,
  max,
  min = 1,
  disabled = false,
  onChange,
}: Props) {
  // Translation
  const t = useTranslations("Cart");

  return (
    <div
      role="group"
      aria-label={t("quantity")}
      className="flex items-center gap-2"
    >
      <Button
        type="button"
        variant="secondary"
        size="icon-lg"
        aria-label={t("decrease")}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
      >
        <Minus aria-hidden="true" size={20} />
      </Button>

      <Input
        inputSize="sm"
        className="w-26 shadow-none"
        variant="default"
        value={value}
        aria-label={t("quantity")}
        readOnly
      />

      <Button
        type="button"
        variant="secondary"
        size="icon-lg"
        aria-label={t("increase")}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
      >
        <Plus aria-hidden="true" size={20} />
      </Button>
    </div>
  );
}
