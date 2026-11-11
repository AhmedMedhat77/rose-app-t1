"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input, PhoneNumberInput } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import { useUpdateProfile } from "../hooks/use-update-profile";
import { GENDER_VALUES } from "../lib/constants/account-settings.constant";
import { createProfileSchema } from "../lib/schemas/profile.schema";
import type {
  ProfileFormValues,
  UserProfile,
} from "../lib/types/profile.types";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { ProfilePhotoUpload } from "./profile-photo-upload";

const INPUT_CLASS = "h-12 rounded-xl shadow-none disabled:bg-bg-muted";

interface ProfileFormProps {
  profile: UserProfile;
}

function toFormValues(user: UserProfile): ProfileFormValues {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? "",
    photo: undefined,
  };
}

export function ProfileForm({ profile }: ProfileFormProps) {
  // Translation
  const t = useTranslations("accountSettings.Profile");

  // Hooks
  const { isPending, updateProfile } = useUpdateProfile();

  // Form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(
      createProfileSchema({
        firstNameRequired: t("errors.firstNameRequired"),
        firstNameTooShort: t("errors.firstNameTooShort"),
        firstNameTooLong: t("errors.firstNameTooLong"),
        lastNameRequired: t("errors.lastNameRequired"),
        lastNameTooShort: t("errors.lastNameTooShort"),
        lastNameTooLong: t("errors.lastNameTooLong"),
        phoneInvalid: t("errors.phoneInvalid"),
        fileSizeExceeded: t("errors.fileSizeExceeded"),
        invalidFileType: t("errors.invalidFileType"),
      }),
    ),
    defaultValues: toFormValues(profile),
    mode: "onChange",
  });

  // Variables
  const genderItems = GENDER_VALUES.map((value) => ({
    value,
    label: value === "MALE" ? t("gender.MALE") : t("gender.FEMALE"),
  }));

  // Functions
  function onSubmit(values: ProfileFormValues) {
    updateProfile(values, {
      onSuccess: (user) => {
        form.reset(toFormValues(user));
      },
    });
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
    >
      <ProfilePhotoUpload
        control={form.control}
        currentPhotoUrl={profile.photo}
        initials={`${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase()}
      />

      <FieldGroup className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        {/* First name */}
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-first-name">
                {t("fields.firstName")}
              </FieldLabel>
              <Input
                {...field}
                id="profile-first-name"
                type="text"
                autoComplete="given-name"
                aria-invalid={fieldState.invalid}
                className={INPUT_CLASS}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Last name */}
        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-last-name">
                {t("fields.lastName")}
              </FieldLabel>
              <Input
                {...field}
                id="profile-last-name"
                type="text"
                autoComplete="family-name"
                aria-invalid={fieldState.invalid}
                className={INPUT_CLASS}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email is read-only */}
        <Field>
          <FieldLabel htmlFor="profile-email">{t("fields.email")}</FieldLabel>
          <Input
            id="profile-email"
            value={profile.email}
            type="email"
            disabled
            readOnly
            autoComplete="email"
            className={INPUT_CLASS}
          />
        </Field>

        {/* Phone */}
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-phone">
                {t("fields.phone")}
              </FieldLabel>
              <PhoneNumberInput
                id="profile-phone"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Gender is read-only */}
        <Field>
          <FieldLabel htmlFor="profile-gender">{t("fields.gender")}</FieldLabel>
          <Select disabled items={genderItems} value={profile.gender ?? null}>
            <SelectTrigger
              id="profile-gender"
              className="disabled:bg-bg-muted w-full rounded-xl data-[size=default]:h-12"
            >
              <SelectValue placeholder={t("fields.genderPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {genderItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <div className="flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DeleteAccountDialog />
        <Button
          type="submit"
          disabled={isPending}
          className="bg-bg-primary h-11 rounded-xl sm:min-w-56"
        >
          {isPending ? t("actions.saving") : t("actions.save")}
        </Button>
      </div>
    </form>
  );
}
