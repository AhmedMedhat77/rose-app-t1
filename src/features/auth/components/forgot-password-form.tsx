"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  // Step state lives in the URL so it survives locale switches, which
  // remount the page but carry the query through (see LocaleSwitcher).
  const sentEmail = searchParams.get("sent");
  const [email, setEmail] = useState("");

  // Replace, not push: stepping back must not leave a history entry.
  const setSentEmail = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value === null) {
      params.delete("sent");
    } else {
      params.set("sent", value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

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
