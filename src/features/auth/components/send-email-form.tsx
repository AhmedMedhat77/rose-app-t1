"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { createSendEmailVerificationSchema } from "@/features/auth/schemas";
import { TSendEmailVerificationValues } from "@/features/auth/types";
import { Link } from "@/i18n/navigation";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { addToast } from "@/shared/ui/toast";

import FormDivider from "./shared/form-divider";
import { useSendEmailVerification } from "../hooks/use-send-email-verification";
import { getRemainingSeconds } from "../lib/otp-cooldown";

export default function SendEmailVerificationForm({
  onSent,
  defaultEmail = "",
}: {
  onSent: (email: string) => void;
  defaultEmail?: string;
}) {
  // translation
  const t = useTranslations("SendEmailVerification");
  // state
  const { mutate, isPending } = useSendEmailVerification();

  // Form
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TSendEmailVerificationValues>({
    resolver: zodResolver(
      createSendEmailVerificationSchema({ emailInvalid: t("emailInvalid") }),
    ),
    defaultValues: { email: defaultEmail },
  });
  // Functions
  const onSubmit = handleSubmit((values) => {
    // The code was already sent recently, continue without sending again
    if (getRemainingSeconds(values.email) > 0) {
      onSent(values.email);
      return;
    }

    mutate(values, {
      onSuccess: () => onSent(values.email),
      onError: (error) => addToast(TOAST_STATE.Unsuccessful, error.message),
    });
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

      <Button className="w-full" type="submit" loading={isPending}>
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
