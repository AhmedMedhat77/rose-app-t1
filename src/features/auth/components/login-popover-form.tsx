"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { createLoginSchema } from "@/features/auth/schemas";
import { Link } from "@/i18n/navigation";

import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { addToast } from "@/shared/ui/toast";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { useLogin } from "../hooks/use-login";
import type { TLoginFormValues } from "../types";

export default function LoginForm() {
  const t = useTranslations("Login");
  const { mutate: login, isPending } = useLogin();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TLoginFormValues>({
    resolver: zodResolver(
      createLoginSchema({
        usernameRequired: t("usernameRequired"),
        passwordRequired: t("passwordRequired"),
      }),
    ),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    login(values, {
      onSuccess: (response) => {
        if (response.url) {
          window.location.assign(response.url);
        }
      },
      onError: () => {
        addToast(TOAST_STATE.Unsuccessful, t("invalidCredentials"));
      },
    });
  });

  return (
    <form noValidate onSubmit={onSubmit} className="w-full space-y-4 p-4">
      <Input
        label={t("username")}
        type="text"
        placeholder={t("usernamePlaceholder")}
        error={errors.username?.message}
        {...register("username")}
      />

      <Input
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex justify-end pt-0.5">
        <Link
          href="/forgot-password"
          className="text-primary text-xs font-semibold transition-colors hover:underline"
        >
          {t("forgotPassword")}
        </Link>
      </div>

      <Button className="w-full" type="submit" loading={isPending}>
        {t("submit")}
      </Button>
    </form>
  );
}
