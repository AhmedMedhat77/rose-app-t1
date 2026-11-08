"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useLogin } from "../hooks/use-login";
import { createLoginSchema } from "@/features/auth/schemas";
import { Link } from "@/i18n/navigation";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { TLoginFormValues } from "../types";
import FormTitle from "./shared/form-title";
import FormDivider from "./shared/form-divider";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { addToast } from "@/shared/ui/toast";
import { getSafeCallbackUrl } from "@/shared/lib/utils/safe-callback-url.util";

export default function LoginForm() {
  // Translation
  const t = useTranslations("Login");

  // State
  const { mutate: login, isPending } = useLogin();

  // Form
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

  // Functions
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
    <form noValidate onSubmit={onSubmit} className="w-full space-y-4">
      <div>
        <FormTitle title={t("title")} />
      </div>

      <Input
        label={t("username")}
        type="text"
        autoComplete="username"
        placeholder={t("usernamePlaceholder")}
        error={errors.username?.message}
        {...register("username")}
      />

      <Input
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        variant="password"
        autoComplete="current-password"
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

      <FormDivider />
      <div className="pt-4 text-center">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-50">
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
