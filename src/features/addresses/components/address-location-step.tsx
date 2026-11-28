"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";

interface IAddressLocationStepProps {
  submitLabel: string;
  onBack: () => void;
  onSubmit: (location: { latitude: number; longitude: number }) => void;
  isPending?: boolean;
}

export default function AddressLocationStep({
  submitLabel,
  onBack,
  onSubmit,
  isPending = false,
}: IAddressLocationStepProps) {
  // Translation
  const t = useTranslations("Addresses");

  // Functions
  // Temporary coordinates until the map is implemented.
  function handleSubmit() {
    onSubmit({
      latitude: 0,
      longitude: 0,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon-sm"
          className="bg-bg-maroon-secondary rounded-full"
          aria-label={t("back")}
          onClick={onBack}
        >
          <ArrowLeft aria-hidden="true" size={20} className="rtl:rotate-180" />
        </Button>

        <p className="text-text-maroon text-2xl font-medium">
          {t("findYourLocation")}
        </p>
      </div>

      {/* TODO (الخطوة الجاية): الخريطة وزرار Find My Location */}
      <div className="bg-bg-muted text-text-muted flex h-64 items-center justify-center rounded-lg text-sm">
        {t("mapPlaceholder")}
      </div>

      <Button
        type="button"
        className="bg-bg-maroon-secondary w-full"
        onClick={handleSubmit}
        loading={isPending}
        disabled={isPending}
      >
        {submitLabel}
      </Button>
    </div>
  );
}
