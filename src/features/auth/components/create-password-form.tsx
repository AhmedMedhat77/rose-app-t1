"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

// عدل المسار والاسم حسب الـ action الحقيقي عندك
import { registerAction } from "@/features/auth/actions/register.action";
import { createPasswordSchema } from "@/features/auth/schemas";
import type {
  TAccountDetailsValues,
  TCreatePasswordValues,
} from "@/features/auth/types";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { addToast } from "@/shared/ui/toast";

import FormDivider from "./shared/form-divider";
import { ArrowRight } from "lucide-react";

type Props = {
  email: string;
  details: TAccountDetailsValues;
  onBack: () => void;
  onRegistered: () => void;
};

export default function CreatePasswordForm({
  email,
  details,
  onBack,
  onRegistered,
}: Props) {
  const t = useTranslations("CreatePassword");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TCreatePasswordValues>({
    resolver: zodResolver(
      createPasswordSchema({
        passwordRequired: t("passwordRequired"),
        passwordMin: t("passwordMin"),
        passwordUppercase: t("passwordUppercase"),
        passwordLowercase: t("passwordLowercase"),
        passwordNumber: t("passwordNumber"),
        passwordSpecial: t("passwordSpecial"),
        confirmPasswordRequired: t("confirmPasswordRequired"),
        passwordMismatch: t("passwordMismatch"),
      }),
    ),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await registerAction({ ...details, email, ...values });

    if (result.success) {
      onRegistered();
    } else {
      addToast(TOAST_STATE.Unsuccessful, result.message);
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex w-full flex-col gap-6">
      <div className="flex flex-col">
        <p className="text-text-primary text-xl font-semibold">
          {t("createStrongPassword")}
        </p>
        <p className="text-text-plain text-base">{t("chooseSecurePassword")}</p>
        <Button
          className="h-fit w-fit p-0"
          variant="ghost"
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
        >
          {t("back")}
        </Button>
      </div>
      <FormDivider />

      <Input
        variant="password"
        label={t("password")}
        autoComplete="new-password"
        autoFocus
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        variant="password"
        label={t("confirmPassword")}
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button className="w-full" type="submit" loading={isSubmitting}>
        {t("next")}
        <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
      </Button>

      <div className="text-center"></div>
    </form>
  );
}
