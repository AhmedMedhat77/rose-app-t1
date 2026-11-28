"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// لو الـ Stepper اتنقل لـ shared، عدّل المسار
import Stepper from "@/features/auth/components/shared/stepper";

import AddressDetailsStep from "./address-details-step";
import AddressLocationStep from "./address-location-step";

import type {
  IAddress,
  TAddressFormValues,
  TCreateAddressPayload,
} from "../types/addresses.types";

interface IAddressFormProps {
  /** null = إضافة، وغير كده = تعديل */
  address: IAddress | null;
  onSubmit: (values: TCreateAddressPayload) => void;
  isPending?: boolean;
}

export default function AddressForm({
  address,
  onSubmit,
  isPending = false,
}: IAddressFormProps) {
  // Translation
  const t = useTranslations("Addresses");

  // State
  const [step, setStep] = useState<1 | 2>(1);

  const [values, setValues] = useState<TAddressFormValues | null>(
    address
      ? {
          city: address.city,
          street: address.street,
          phone: address.phone,
        }
      : null,
  );

  // Functions
  function handleLocationSubmit(location: {
    latitude: number;
    longitude: number;
  }) {
    if (!values) return;

    // Combine address details with location coordinates.
    onSubmit({
      ...values,
      title: address?.title ?? "Home",
      isPrimary: address?.isPrimary ?? false,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Stepper step={step} totalSteps={2} fullWidth className="h-2" />

      {step === 1 ? (
        <AddressDetailsStep
          defaultValues={values}
          onNext={(next) => {
            setValues(next);
            setStep(2);
          }}
        />
      ) : (
        <AddressLocationStep
          submitLabel={address ? t("updateAddress") : t("addAddress")}
          isPending={isPending}
          onBack={() => setStep(1)}
          onSubmit={handleLocationSubmit}
        />
      )}
    </div>
  );
}
