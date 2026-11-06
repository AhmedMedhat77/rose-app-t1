"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { startTransition } from "react";
import { useForm } from "react-hook-form";

import { createLoginSchema } from "@/features/auth/schemas";
import { Link } from "@/i18n/navigation";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { TLoginFormValues } from "../types";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { addToast } from "@/shared/ui/toast";

export default function LoginForm() {
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
    <form noValidate onSubmit={onSubmit} className="w-full space-y-4 p-4">
      <Input
        label={t("email")}
        type="email"
        placeholder={t("emailPlaceholder")}
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />

      {/* Forgot password */}
      <div className="flex justify-end pt-0.5">
        <Link
          href="/forgot-password"
          className="text-primary text-xs font-semibold transition-colors hover:underline"
        >
          {t("forgotPassword")}
        </Link>
      </div>

      {/* Login Button */}
      <Button className="w-full" type="submit" loading={isSubmitting}>
        {t("submit")}
      </Button>
    </form>
  );
}
