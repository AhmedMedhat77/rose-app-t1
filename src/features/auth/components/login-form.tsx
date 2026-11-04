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
import FormTitle from "./shared/form-title";
import FormDivider from "./shared/form-divider";

export default function LoginForm() {
  const t = useTranslations("Login");
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
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
      setError("root", {
        message: t("invalidCredentials"),
      });
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} className="w-full space-y-4">
      <div>
        <FormTitle title={t("title")} />
      </div>
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
          className="text-primary text-xs transition-colors hover:underline"
        >
          {t("forgotPassword")}
        </Link>
      </div>

      {/* Root error */}
      {errors.root && (
        <p className="rounded-lg border border-red-500/30 bg-red-950/40 p-2 text-center text-xs text-red-400">
          {errors.root.message}
        </p>
      )}

      {/* Login Button */}
      <Button className="w-full" type="submit" loading={isSubmitting}>
        {t("submit")}
      </Button>

      {/* Divider & Create account link */}
      <FormDivider />
      <div className="pt-4 text-center">
        <p className="zinc-800 text-sm font-medium dark:text-zinc-50">
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="text-primary font-bold hover:underline"
          >
            {t("createAccount")}
          </Link>
        </p>
      </div>
    </form>
  );
}
