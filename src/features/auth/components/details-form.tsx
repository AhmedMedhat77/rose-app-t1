"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { createAccountDetailsSchema } from "@/features/auth/schemas";
import { TAccountDetailsValues } from "@/features/auth/types";
import { Button } from "@/shared/ui/button";
import { Input, PhoneNumberInput } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { ArrowRight } from "lucide-react";

import FormDivider from "./shared/form-divider";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";

type Props = {
  defaultValues?: TAccountDetailsValues | null;
  onContinue: (values: TAccountDetailsValues) => void;
};

export default function AccountDetailsForm({
  defaultValues,
  onContinue,
}: Props) {
  const t = useTranslations("AccountDetails");

  // القيمة بحروف كبيرة (بتتبعت للـ API)، والـ label مترجم
  const genderOptions = [
    { value: "MALE", label: t("male") },
    { value: "FEMALE", label: t("female") },
  ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TAccountDetailsValues>({
    resolver: zodResolver(
      createAccountDetailsSchema({
        firstNameRequired: t("firstNameRequired"),
        lastNameRequired: t("lastNameRequired"),
        usernameRequired: t("usernameRequired"),
        phoneRequired: t("phoneRequired"),
        phoneInvalid: t("phoneInvalid"),
        genderRequired: t("genderRequired"),
      }),
    ),
    defaultValues: defaultValues ?? {
      firstName: "",
      lastName: "",
      username: "",
      phone: "",
    },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onContinue)}
      className="flex w-full flex-col gap-6"
    >
      <div className="flex flex-col">
        <p className="text-text-primary text-xl font-semibold">
          {t("enterYourDetails")}
        </p>
        <p className="text-text-plain text-base">{t("weNeedFewDetails")}</p>
      </div>
      <FormDivider />

      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          className="flex-1"
          label={t("firstName")}
          type="text"
          placeholder={t("firstNamePlaceholder")}
          error={errors.firstName?.message}
          {...register("firstName")}
        />

        <Input
          className="flex-1"
          type="text"
          placeholder={t("lastNamePlaceholder")}
          label={t("lastName")}
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <Input
        label={t("username")}
        placeholder={t("usernamePlaceholder")}
        error={errors.username?.message}
        {...register("username")}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <Field className="w-full" data-invalid={fieldState.invalid}>
            <FieldLabel
              className="text-text-default dark:text-text-soft text-[0.9rem] leading-[100%] font-medium tracking-[0%]"
              htmlFor="phone"
            >
              {t("phone")}
            </FieldLabel>

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

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel
              htmlFor="gender"
              className="text-text-default dark:text-text-soft text-[0.9rem] leading-[100%] font-medium tracking-[0%]"
            >
              {t("gender")}
            </FieldLabel>

            <Select
              items={genderOptions}
              value={field.value ?? null}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id="gender"
                ref={field.ref}
                onBlur={field.onBlur}
                aria-invalid={!!errors.gender}
                aria-describedby={errors.gender ? "gender-error" : undefined}
              >
                <SelectValue placeholder={t("selectGender")} />
              </SelectTrigger>

              <SelectContent>
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.gender?.message && (
              <p
                id="gender-error"
                role="alert"
                className="text-sm text-red-500"
              >
                {errors.gender.message}
              </p>
            )}
          </Field>
        )}
      />

      <Button className="w-full" type="submit">
        {t("next")}
        <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
      </Button>
    </form>
  );
}
