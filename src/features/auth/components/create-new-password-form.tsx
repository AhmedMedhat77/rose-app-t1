"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { startTransition } from "react";
import { useForm } from "react-hook-form";

import { createResetPasswordSchema } from "@/features/auth/schemas";
import { TResetPasswordFormValues } from "@/features/auth/types";
import { useResetPassword } from "../hooks/use-reset-password";
import { useRouter } from "@/i18n/navigation";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { addToast } from "@/shared/ui/toast";

import FormDivider from "./shared/form-divider";

export default function CreateNewPasswordForm({ token }: { token: string }) {
  // Translation
  const t = useTranslations("ResetPassword");
  // Navigation
  const router = useRouter();

  // State
  const { mutate: resetPassword, isPending } = useResetPassword();

  // Form
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TResetPasswordFormValues>({
    resolver: zodResolver(
      createResetPasswordSchema({
        passwordRequired: t("passwordRequired"),
        passwordMin: t("passwordMin"),
        confirmRequired: t("confirmRequired"),
        passwordsMismatch: t("passwordsMismatch"),
      }),
    ),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  // Functions
  const onSubmit = handleSubmit((values) => {
    resetPassword(
      { ...values, token },
      {
        onSuccess: () => {
          addToast(TOAST_STATE.Successful, t("successToast"));
          startTransition(() => {
            router.push("/login");
          });
        },
        onError: () => addToast(TOAST_STATE.Unsuccessful, t("errorToast")),
      },
    );
  });

  return (
    <form noValidate onSubmit={onSubmit} className="w-full space-y-4">
      <div className="text-zinc-800 dark:text-zinc-50">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
      </div>
      <FormDivider />

      <Input
        label={t("password")}
        variant="password"
        autoComplete="new-password"
        placeholder={t("passwordPlaceholder")}
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <Input
        label={t("confirmPassword")}
        variant="password"
        autoComplete="new-password"
        placeholder={t("passwordPlaceholder")}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button className="w-full" type="submit" loading={isPending}>
        {t("submit")}
      </Button>
    </form>
  );
}
