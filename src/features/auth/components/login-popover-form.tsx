"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { createLoginSchema } from "@/features/auth/schemas";
import { Link } from "@/i18n/navigation";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { TLoginFormValues } from "../types";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { addToast } from "@/shared/ui/toast";
import { getSafeCallbackUrl } from "@/shared/lib/utils/safe-callback-url.util";
import { useLogin } from "../hooks/use-login";

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
      onSuccess: () => {
        const searchParams = new URLSearchParams(window.location.search);
        const safeCallbackUrl = getSafeCallbackUrl(
          searchParams.get("callbackUrl"),
        );

        if (safeCallbackUrl) {
          window.location.href = safeCallbackUrl;
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
      <Button className="w-full" type="submit" loading={isPending}>
        {t("submit")}
      </Button>
    </form>
  );
}
