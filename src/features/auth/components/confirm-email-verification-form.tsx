"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";
import { confirmEmailVerificationAction } from "@/features/auth/actions/confirm-email-verification.action";
import { sendEmailVerificationAction } from "@/features/auth/actions/send-email-verification.action";
import { createConfirmEmailVerificationSchema } from "@/features/auth/schemas";
import { TConfirmEmailVerificationValues } from "@/features/auth/types";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { Button } from "@/shared/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/ui/input-otp";
import { addToast } from "@/shared/ui/toast";
import FormDivider from "./shared/form-divider";

const RESEND_SECONDS = 60;

type Props = {
  onConfirmed: () => void;
  onEdit: () => void;
  defaultEmail?: string;
};

export default function ConfirmEmailVerificationForm({
  onConfirmed,
  onEdit,
  defaultEmail = "",
}: Props) {
  const t = useTranslations("ConfirmEmailVerification");

  const [resendLoading, setResendLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  // الـ cooldown بيبدأ من أول ما الصفحة تفتح، لأن الكود اتبعت لتوه
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<TConfirmEmailVerificationValues>({
    resolver: zodResolver(
      createConfirmEmailVerificationSchema({
        emailInvalid: t("emailInvalid"),
        codeRequired: t("codeRequired"),
        codeLength: t("codeLength"),
      }),
    ),
    defaultValues: { email: defaultEmail, code: "" },
  });

  const code = useWatch({
    control,
    name: "code",
    defaultValue: "",
  });
  const onSubmit = handleSubmit(async (values) => {
    const result = await confirmEmailVerificationAction({
      email: values.email,
      code: values.code,
    });

    if (result.success) {
      onConfirmed();
    } else {
      addToast(TOAST_STATE.Unsuccessful, result.message);
      resetField("code");
    }
  });

  async function handleResend() {
    setResendLoading(true);
    try {
      const result = await sendEmailVerificationAction({ email: defaultEmail });
      if (result.success) {
        addToast(TOAST_STATE.Successful, t("codeResent"));
        setSecondsLeft(RESEND_SECONDS);
      } else {
        addToast(TOAST_STATE.Unsuccessful, result.message);
      }
    } finally {
      setResendLoading(false);
    }
  }

  const resendDisabled = resendLoading || secondsLeft > 0;

  return (
    <form noValidate onSubmit={onSubmit} className="flex w-full flex-col gap-6">
      {/*  edit */}

      <div className="flex flex-col">
        <p className="text-text-primary text-xl font-semibold">
          {t("enterOTPCode")}
        </p>
        <p className="text-text-plain text-base">
          {t("weHaveSentCode")} {defaultEmail}{" "}
          <button
            type="button"
            onClick={onEdit}
            className="cursor-pointer text-blue-600 underline"
          >
            {t("edit")}
          </button>
        </p>
      </div>

      <FormDivider />
      {/* OTP Input & Resend */}
      <div className="flex flex-col gap-2">
        <div dir="ltr" className="flex justify-center">
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                autoComplete="one-time-code"
                autoFocus
                aria-label={t("enterOTPCode")}
                aria-invalid={!!errors.code}
                aria-describedby={errors.code ? "code-error" : undefined}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                onComplete={() => onSubmit()} // يبعت تلقائي لما يكمل 6 أرقام
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }, (_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        </div>

        {errors.code?.message && (
          <p
            id="code-error"
            role="alert"
            className="text-destructive text-center text-sm"
          >
            {errors.code.message}
          </p>
        )}
        <Button
          variant={"ghost"}
          type="button"
          onClick={handleResend}
          disabled={resendDisabled}
          className="ms-auto block"
        >
          {resendLoading
            ? t("sending")
            : secondsLeft > 0
              ? t("resendIn", { seconds: secondsLeft })
              : t("sendANewCode")}
        </Button>
      </div>

      <Button
        className="w-full"
        type="submit"
        loading={isSubmitting}
        disabled={code.length !== 6 || isSubmitting}
      >
        {t("verifyCode")}
      </Button>
    </form>
  );
}
