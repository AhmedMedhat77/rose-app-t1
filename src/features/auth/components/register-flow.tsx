"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import type { TAccountDetailsValues } from "@/features/auth/types";

import ConfirmEmailVerificationForm from "./confirm-email-verification-form";
import CreatePasswordForm from "./create-password-form";
import SendEmailVerificationForm from "./send-email-form";
import FormDivider from "./shared/form-divider";
import FormTitle from "./shared/form-title";
import Stepper from "./shared/stepper";
import AccountDetailsForm from "./details-form";

type Step = "email" | "otp" | "details" | "password";

const STEP_NUMBER: Record<Step, number> = {
  email: 1,
  otp: 2,
  details: 3,
  password: 4,
};

export default function RegisterFlow() {
  const t = useTranslations("RegisterFlow");
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState<TAccountDetailsValues | null>(null);

  // لو وصلنا لـ password من غير details (مفروض ما يحصلش)، ارجع لـ details
  const currentStep: Step = step === "password" && !details ? "details" : step;

  const isEmailStep = currentStep === "email";

  function renderStep() {
    switch (currentStep) {
      case "email":
        return (
          <SendEmailVerificationForm
            defaultEmail={email}
            onSent={(value) => {
              setEmail(value);
              setStep("otp");
            }}
          />
        );

      case "otp":
        return (
          <ConfirmEmailVerificationForm
            defaultEmail={email}
            onConfirmed={() => setStep("details")}
            onEdit={() => setStep("email")}
          />
        );

      case "details":
        return (
          <AccountDetailsForm
            defaultValues={details}
            onContinue={(values) => {
              setDetails(values);
              setStep("password");
            }}
          />
        );

      case "password":
        return (
          details && (
            <CreatePasswordForm
              email={email}
              details={details}
              onBack={() => setStep("details")}
              onRegistered={() => router.replace("/login")}
            />
          )
        );
    }
  }

  return (
    <div className="w-full">
      {/* ===== مشترك: العنوان ===== */}
      <FormTitle title={t("header")} />

      <div className="flex flex-col gap-9">
        {!isEmailStep && (
          <Stepper step={STEP_NUMBER[currentStep]} totalSteps={4} fullWidth />
        )}

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            {!isEmailStep && (
              <h2 className="text-text-plain text-3xl font-bold">
                {t("title")}
              </h2>
            )}
            {renderStep()}
          </div>

          {/* ===== مشترك: الفوتر ===== */}
          {!isEmailStep && (
            <>
              <FormDivider />
              <div className="pt-4 text-center">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-50">
                  {t("needHelp")}{" "}
                  <a
                    href="#"
                    className="text-primary font-bold hover:underline"
                  >
                    {t("contactUs")}
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
