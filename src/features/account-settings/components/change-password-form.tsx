"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useChangePassword } from "../hooks/use-change-password";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../lib/schemas/change-password.schema";
import {
  ChangePasswordRequestError,
  fieldErrorKey,
} from "../lib/types/change-password.types";

const INPUT_CLASS = "h-12 rounded-xl shadow-none";

export function ChangePasswordForm() {
  const t = useTranslations("accountSettings.changePasswordContent");
  const { mutate, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const translateError = (message?: string) =>
    message ? t(message as Parameters<typeof t>[0]) : undefined;

  const onSubmit = (values: ChangePasswordFormValues) => {
    mutate(values, {
      onSuccess: () => reset(),
      onError: (error) => {
        if (!(error instanceof ChangePasswordRequestError)) return;

        for (const field of error.fields) {
          setError(field, { message: fieldErrorKey(field) });
        }
      },
    });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-h-[32rem] flex-col md:min-h-[40rem]"
    >
      <div className="flex flex-col gap-6">
        <Input
          {...register("oldPassword")}
          id="change-password-old"
          variant="password"
          autoComplete="current-password"
          className={INPUT_CLASS}
          label={t("form.oldPassword")}
          placeholder="********"
          error={translateError(errors.oldPassword?.message)}
          isError={Boolean(errors.oldPassword)}
          aria-invalid={Boolean(errors.oldPassword) || undefined}
        />
        <hr className="bg-bg-soft" />
        <Input
          {...register("newPassword")}
          id="change-password-new"
          variant="password"
          placeholder="********"
          autoComplete="new-password"
          className={INPUT_CLASS}
          label={t("form.newPassword")}
          error={translateError(errors.newPassword?.message)}
          isError={Boolean(errors.newPassword)}
          aria-invalid={Boolean(errors.newPassword) || undefined}
        />

        <Input
          {...register("confirmNewPassword")}
          id="change-password-confirm"
          variant="password"
          placeholder="********"
          autoComplete="new-password"
          className={INPUT_CLASS}
          label={t("form.confirmPassword")}
          error={translateError(errors.confirmNewPassword?.message)}
          isError={Boolean(errors.confirmNewPassword)}
          aria-invalid={Boolean(errors.confirmNewPassword) || undefined}
        />
      </div>

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
