"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { startTransition } from "react";
import { useForm } from "react-hook-form";

import { createLoginSchema } from "@/features/auth/schemas";
import { Link } from "@/i18n/navigation";

import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { addToast } from "@/shared/ui/toast";
import { TLoginFormValues } from "../types";
import FormDivider from "./shared/form-divider";

export default function ForgotPasswordForm() {
  const t = useTranslations("Login");

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<TLoginFormValues>({
    resolver: zodResolver(
      createLoginSchema({
        emailInvalid: t("emailInvalid"),
        passwordRequired: t("passwordRequired"),
      }),
    ),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const response = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (response?.ok) {
      const searchParams = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : "",
      );
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      startTransition(() => {
        window.location.href = callbackUrl;
      });
    } else {
      addToast(TOAST_STATE.Unsuccessful, t("invalidCredentials"));
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} className="w-full space-y-4">
      <div className="text-zinc-800 dark:text-zinc-50">
        <h1 className="text-3xl font-semibold">Forgot Password?</h1>
        <p>Worry not, we’ll send you instructions to help you reset it.</p>
      </div>
      <FormDivider />

      <Input
        label={t("email")}
        type="email"
        placeholder={t("emailPlaceholder")}
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Login Button */}
      <Button className="w-full" type="submit" loading={isSubmitting}>
        Next
      </Button>

      {/* Divider & Create account link */}
      <FormDivider />
      <div className="pt-4 text-center">
        <p className="zinc-800 text-sm font-medium dark:text-zinc-50">
          {"Don't have an account?"}{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:underline"
          >
            Create one now!
          </Link>
        </p>
      </div>
    </form>
  );
}
