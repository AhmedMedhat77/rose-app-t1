"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { usePasswordResetSent } from "../hooks/use-password-reset-sent";

import CreateNewPasswordForm from "./create-new-password-form";
import ForgotPasswordRequestForm from "./forgot-password-request-form";
import ResetPasswordSent from "./reset-password-sent";

/**
 * Single-route forgot-password flow with internal steps:
 *  1. request  — enter email, triggers the reset email
 *  2. sent     — confirmation showing the exact email entered
 *  3. reset    — new password, shown when the emailed link lands here
 *                with a `?token=` query param.
 */
export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { sentEmail, setSentEmail } = usePasswordResetSent();
  const [email, setEmail] = useState("");

  // The reset link drives step 3 regardless of in-page state.
  if (token) {
    return <CreateNewPasswordForm token={token} />;
  }

  if (sentEmail !== null) {
    return (
      <ResetPasswordSent
        email={sentEmail}
        onBack={() => {
          setEmail(sentEmail);
          setSentEmail(null);
        }}
      />
    );
  }

  return (
    <ForgotPasswordRequestForm
      defaultEmail={email}
      onSent={(value) => {
        setEmail(value);
        setSentEmail(value);
      }}
    />
  );
}
