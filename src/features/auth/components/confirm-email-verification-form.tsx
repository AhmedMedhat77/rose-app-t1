"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useConfirmEmail } from "@/features/auth/hooks/use-confirm-email";
import { useOtpCooldown } from "@/features/auth/hooks/use-otp-cooldown";
import { useSendEmailVerification } from "@/features/auth/hooks/use-send-email-verification";
import {
  clearOtpSent,
  getRemainingSeconds,
} from "@/features/auth/lib/otp-cooldown";
import { createConfirmEmailSchema } from "@/features/auth/schemas/confirm-email.schema";
import { TConfirmEmailFormValues } from "@/features/auth/types/confirm-email.types";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { Button } from "@/shared/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/ui/input-otp";
import { addToast } from "@/shared/ui/toast";

import FormDivider from "./shared/form-divider";

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
  // Translation
  const t = useTranslations("ConfirmEmailVerification");

  // State
  const { secondsLeft, sync } = useOtpCooldown(defaultEmail);
  const confirmMutation = useConfirmEmail();
  const resendMutation = useSendEmailVerification();
  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<TConfirmEmailFormValues>({
    resolver: zodResolver(
      createConfirmEmailSchema({
        emailInvalid: t("emailInvalid"),
        codeRequired: t("codeRequired"),
        codeLength: t("codeLength"),
      }),
    ),
    defaultValues: { email: defaultEmail, code: "" },
  });
  const code = useWatch({ control, name: "code", defaultValue: "" });

  // Variables
  const isResendDisabled = resendMutation.isPending || secondsLeft > 0;

  // Functions
  const onSubmit = handleSubmit((values) => {
    confirmMutation.mutate(
      { email: values.email, code: values.code },
      {
        onSuccess: () => {
          clearOtpSent();
          onConfirmed();
        },
        onError: (error) => {
          addToast(TOAST_STATE.Unsuccessful, error.message);
          resetField("code");
        },
      },
    );
  });

  function handleResend() {
    if (getRemainingSeconds(defaultEmail) > 0) return;

    resendMutation.mutate(
      { email: defaultEmail },
      {
        onSuccess: () => {
          sync();
          addToast(TOAST_STATE.Successful, t("codeResent"));
        },
        onError: (error) => {
          addToast(TOAST_STATE.Unsuccessful, error.message);
        },
      },
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex w-full flex-col gap-6">
      <div className="flex flex-col">
        <p className="text-text-primary text-xl font-semibold">
          {t("enterOTPCode")}
        </p>
        <p className="text-text-plain text-base">
          {t("weHaveSentCode")} {defaultEmail}{" "}
          <button
            type="button"
            onClick={onEdit}
            className="text-text-primary cursor-pointer underline"
          >
            {t("edit")}
          </button>
        </p>
      </div>

      <FormDivider />

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
                onComplete={() => onSubmit()}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot key={index} index={index} />
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
            className="text-text-danger text-center text-sm"
          >
            {errors.code.message}
          </p>
        )}

        <Button
          variant="ghost"
          type="button"
          onClick={handleResend}
          disabled={isResendDisabled}
          className="ms-auto block"
        >
          {resendMutation.isPending
            ? t("sending")
            : secondsLeft > 0
              ? t("resendIn", { seconds: secondsLeft })
              : t("sendANewCode")}
        </Button>
      </div>

      <Button
        className="w-full"
        type="submit"
        loading={confirmMutation.isPending}
        disabled={code.length !== 6 || confirmMutation.isPending}
      >
        {t("verifyCode")}
      </Button>
    </form>
  );
}
