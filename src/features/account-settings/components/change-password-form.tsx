"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

import { useChangePassword } from "../hooks/use-change-password";
import { createChangePasswordSchema } from "../lib/schemas/change-password.schema";
import {
  ChangePasswordRequestError,
  type ChangePasswordFormValues,
} from "../lib/types/change-password.types";
import { fieldErrorKey } from "../lib/utils/change-password.util";

const INPUT_CLASS = "h-12 rounded-xl shadow-none";

export function ChangePasswordForm() {
  // Translation
  const t = useTranslations("accountSettings.changePasswordContent");

  // Hooks
  const { changePassword, isPending } = useChangePassword();

  // Form
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(
      createChangePasswordSchema({
        required: t("validation.required"),
        passwordMinLength: t("validation.password_min_length"),
        passwordUppercase: t("validation.password_uppercase"),
        passwordLowercase: t("validation.password_lowercase"),
        passwordNumber: t("validation.password_number"),
        passwordSpecial: t("validation.password_special"),
        passwordSameAsOld: t("validation.password_same_as_old"),
        passwordsDoNotMatch: t("validation.passwords_do_not_match"),
      }),
    ),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Functions
  function onSubmit(values: ChangePasswordFormValues) {
    changePassword(values, {
      onSuccess: () => form.reset(),
      onError: (error) => {
        if (!(error instanceof ChangePasswordRequestError)) return;

        for (const field of error.fields) {
          form.setError(field, { message: t(fieldErrorKey(field)) });
        }
      },
    });
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex min-h-128 flex-col"
    >
      <FieldGroup className="flex flex-col gap-6">
        {/* Old password */}
        <Controller
          name="oldPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="change-password-old">
                {t("form.oldPassword")}
              </FieldLabel>
              <Input
                {...field}
                id="change-password-old"
                variant="password"
                autoComplete="current-password"
                placeholder="********"
                aria-invalid={fieldState.invalid}
                className={INPUT_CLASS}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <hr className="bg-bg-soft" />

        {/* New password */}
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="change-password-new">
                {t("form.newPassword")}
              </FieldLabel>
              <Input
                {...field}
                id="change-password-new"
                variant="password"
                autoComplete="new-password"
                placeholder="********"
                aria-invalid={fieldState.invalid}
                className={INPUT_CLASS}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Confirm password */}
        <Controller
          name="confirmNewPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="change-password-confirm">
                {t("form.confirmPassword")}
              </FieldLabel>
              <Input
                {...field}
                id="change-password-confirm"
                variant="password"
                autoComplete="new-password"
                placeholder="********"
                aria-invalid={fieldState.invalid}
                className={INPUT_CLASS}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end pt-15">
        <Button
          type="submit"
          loading={isPending}
          className="h-11 w-full rounded-xl sm:w-auto sm:min-w-56"
        >
          {isPending ? t("form.submitting") : t("form.submit")}
        </Button>
      </div>
    </form>
  );
}
