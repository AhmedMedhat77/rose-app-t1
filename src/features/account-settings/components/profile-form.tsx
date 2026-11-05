"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
// ASSUMPTION: PhoneNumberInput is exported from the same file as Input. It must accept the
// props used below; see PHONE_INPUT_RECOMMENDATIONS.md.
import { Input, PhoneNumberInput } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useProfile } from "../hooks/use-profile";
import { useUpdateProfile } from "../hooks/use-update-profile";
import {
  GENDER_VALUES,
  profileSchema,
  type ProfileFormValues,
} from "../lib/schemas/profile.schema";
import type { UserProfile } from "../lib/types/profile.types";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { ProfileFormSkeleton } from "./profile-form-skeleton";
import { ProfilePhotoUpload } from "./profile-photo-upload";

const INPUT_CLASS = "h-12 rounded-xl";

function toFormValues(user: UserProfile): Partial<ProfileFormValues> {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? "",
    gender: user.gender ?? undefined,
    photo: undefined,
  };
}

export function ProfileForm() {
  const t = useTranslations("accountSettings.Profile");
  const {
    data: profile,
    isPending,
    isError,
    refetch,
    isRefetching,
  } = useProfile();

  if (isPending) return <ProfileFormSkeleton />;

  if (isError || !profile) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3">
        <h2 className="text-lg font-semibold">{t("loadError.title")}</h2>
        <p className="text-muted-foreground text-sm">
          {t("loadError.description")}
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={isRefetching}
          onClick={() => refetch()}
        >
          {t("loadError.retry")}
        </Button>
      </div>
    );
  }

  return <ProfileFormFields profile={profile} />;
}

function ProfileFormFields({ profile }: { profile: UserProfile }) {
  const t = useTranslations("accountSettings.Profile");
  const { mutate: saveProfile, isPending } = useUpdateProfile();

  const { control, handleSubmit, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: toFormValues(profile),
    mode: "onChange", // also validates the photo as soon as a file is picked
  });

  const [firstName, lastName] = useWatch({
    control,
    name: ["firstName", "lastName"],
  });
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  // Base UI Select shows the raw value unless it's given value/label pairs.
  const genderItems = GENDER_VALUES.map((value) => ({
    value,
    label: t(`gender.${value}`),
  }));

  // Schema messages are i18n keys (e.g. "errors.invalidEmail").
  const errorsFor = (message?: string) =>
    message ? [{ message: t(message as Parameters<typeof t>[0]) }] : undefined;

  const onSubmit = (values: ProfileFormValues) => {
    saveProfile(values, {
      onSuccess: (user) => reset(toFormValues(user)),
    });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
    >
      <ProfilePhotoUpload
        control={control}
        currentPhotoUrl={profile.photo}
        initials={initials}
      />

      <FieldGroup className="gap-5">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <Controller
            name="firstName"
            control={control}
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
                {fieldState.invalid && (
                  <FieldError errors={errorsFor(fieldState.error?.message)} />
                )}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={control}
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
                {fieldState.invalid && (
                  <FieldError errors={errorsFor(fieldState.error?.message)} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Email is shown read-only: changing it requires the verify-by-code flow
            (POST /api/users/email/request), which has no design or spec yet. */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="profile-email">
                {t("fields.email")}
              </FieldLabel>
              <Input
                {...field}
                id="profile-email"
                type="email"
                dir="ltr"
                disabled
                className={INPUT_CLASS}
              />
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={control}
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
              {fieldState.invalid && (
                <FieldError errors={errorsFor(fieldState.error?.message)} />
              )}
            </Field>
          )}
        />

        <Controller
          name="gender"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-gender">
                {t("fields.gender")}
              </FieldLabel>
              <Select
                items={genderItems}
                value={field.value ?? null}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger
                  id="profile-gender"
                  aria-invalid={fieldState.invalid}
                  onBlur={field.onBlur}
                  className="w-full rounded-xl data-[size=default]:h-12"
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
              {fieldState.invalid && (
                <FieldError errors={errorsFor(fieldState.error?.message)} />
              )}
            </Field>
          )}
        />
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
