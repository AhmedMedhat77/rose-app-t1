"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { createForgotPasswordSchema } from "@/features/auth/schemas";
import { TForgotPasswordFormValues } from "@/features/auth/types";
import { useForgotPassword } from "../hooks/use-forgot-password";
import { Link } from "@/i18n/navigation";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { addToast } from "@/shared/ui/toast";

import FormDivider from "./shared/form-divider";

export default function ForgotPasswordRequestForm({
  onSent,
  defaultEmail = "",
}: {
  onSent: (email: string) => void;
  defaultEmail?: string;
}) {
  // Translation
  const t = useTranslations("ForgotPassword");
  const locale = useLocale();

  // State
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  // Form
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TForgotPasswordFormValues>({
    resolver: zodResolver(
      createForgotPasswordSchema({ emailInvalid: t("emailInvalid") }),
    ),
    defaultValues: { email: defaultEmail },
  });

  // Functions
  const onSubmit = handleSubmit((values) => {
    // Backend appends ?token=... to this URL for the reset link, landing the
    // user back on this same route where the new-password step is shown.
    const redirectUrl = `${window.location.origin}/${locale}/forgot-password`;
    forgotPassword(
      { ...values, redirectUrl },
      {
        onSuccess: () => onSent(values.email),
        onError: () => addToast(TOAST_STATE.Unsuccessful, t("errorToast")),
      },
    );
  });

  return (
    <form noValidate onSubmit={onSubmit} className="w-full space-y-4">
      <div className="text-zinc-800 dark:text-zinc-50">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p>{t("description")}</p>
      </div>
      <FormDivider />

      <Input
        label={t("email")}
        type="email"
        placeholder={t("emailPlaceholder")}
        error={errors.email?.message}
        {...register("email")}
      />

      <Button className="w-full" type="submit" loading={isPending}>
        {t("submit")}
      </Button>

      <FormDivider />
      <div className="pt-4 text-center">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-50">
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="text-primary font-bold hover:underline"
          >
            {t("createAccount")}
          </Link>
        </p>
      </div>
    </form>
  );
}
