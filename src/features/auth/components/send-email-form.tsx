"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { createSendEmailVerificationSchema } from "@/features/auth/schemas";
import { TSendEmailVerificationValues } from "@/features/auth/types";
import { sendEmailVerificationAction } from "@/features/auth/actions/send-email-verification.action";
import { Link } from "@/i18n/navigation";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { addToast } from "@/shared/ui/toast";

import FormDivider from "./shared/form-divider";

export default function SendEmailVerificationForm({
  onSent,
  defaultEmail = "",
}: {
  onSent: (email: string) => void;
  defaultEmail?: string;
}) {
  const t = useTranslations("SendEmailVerification");

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<TSendEmailVerificationValues>({
    resolver: zodResolver(
      createSendEmailVerificationSchema({ emailInvalid: t("emailInvalid") }),
    ),
    defaultValues: { email: defaultEmail },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await sendEmailVerificationAction(values);

    if (result.success) {
      onSent(values.email);
    } else {
      addToast(TOAST_STATE.Unsuccessful, result.message);
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex w-full flex-col gap-6">
      <Input
        label={t("email")}
        type="email"
        placeholder={t("emailPlaceholder")}
        error={errors.email?.message}
        {...register("email")}
      />

      <Button className="w-full" type="submit" loading={isSubmitting}>
        {t("sendCode")}
      </Button>

      <FormDivider />
      <div className="pt-4 text-center">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-50">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:underline"
          >
            {t("login")}
          </Link>
        </p>
      </div>
    </form>
  );
}
