"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input, PhoneNumberInput } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

import { createAddressSchema } from "../schemas/addresses.schema";
import type { TAddressFormValues } from "../types/addresses.types";

interface IAddressDetailsStepProps {
  defaultValues: TAddressFormValues | null;
  onNext: (values: TAddressFormValues) => void;
}

export default function AddressDetailsStep({
  defaultValues,
  onNext,
}: IAddressDetailsStepProps) {
  // Translation
  const t = useTranslations("Addresses");

  // State
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TAddressFormValues>({
    resolver: zodResolver(
      createAddressSchema({
        cityRequired: t("cityRequired"),
        addressRequired: t("addressRequired"),
        phoneRequired: t("phoneRequired"),
        phoneInvalid: t("phoneInvalid"),
      }),
    ),
    defaultValues: defaultValues ?? { city: "", street: "", phone: "" },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onNext)}
      className="flex flex-col gap-4"
    >
      <p className="text-text-maroon border-border-muted border-b pb-3 text-2xl font-medium">
        {t("enterAddressDetails")}
      </p>

      <Input
        label={t("city")}
        placeholder={t("cityPlaceholder")}
        autoComplete="address-level2"
        className="shadow-none"
        error={errors.city?.message}
        {...register("city")}
      />

      <Field data-invalid={!!errors.street}>
        <Textarea
          label={t("address")}
          id="street"
          rows={4}
          className="resize-none"

          autoComplete="street-address"
          placeholder={t("addressPlaceholder")}
          aria-invalid={!!errors.street}
          {...register("street")}
        />
        {errors.street && <FieldError errors={[errors.street]} />}
      </Field>

      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="phone">{t("phone")}</FieldLabel>
            <PhoneNumberInput
              id="phone"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" className="bg-bg-maroon-secondary w-full">
        {t("next")}
      </Button>
    </form>
  );
}
