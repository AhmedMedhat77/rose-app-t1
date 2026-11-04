"use client";

import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { loginSchema } from "@/features/auth/schemas";
import { AuthTextField } from "./auth-text-field";
import { AuthPasswordField } from "./auth-password-field";
import { TLoginFormValues } from "../types";
import FormTitle from "./form-title";

export default function LoginForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TLoginFormValues>({
    resolver: zodResolver(loginSchema),
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
        message: response?.error || "Invalid credentials. Please try again.",
      });
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} className="w-full space-y-4">
      <FormTitle title="Welcome back!" />
      <AuthTextField
        label="Email"
        type="email"
        placeholder="user@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <AuthPasswordField
        label="Password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      {/* Forgot password */}
      <div className="flex justify-end pt-0.5">
        <Link
          href="/forgot-password"
          className="text-xs text-[#ffa3b9] transition-colors hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      {/* Root error */}
      {errors.root && (
        <p className="rounded-lg border border-red-500/30 bg-red-950/40 p-2 text-center text-xs text-red-400">
          {errors.root.message}
        </p>
      )}

      {/* Login Button */}
      <Button
        type="submit"
        loading={isSubmitting}
        className="h-11 w-full rounded-lg bg-[#ffa3b9] text-sm font-semibold text-zinc-900 transition-colors hover:bg-[#ff8fa9]"
      >
        Login
      </Button>

      {/* Divider & Create account link */}
      <div className="w-full border-t border-zinc-700/60 pt-4 text-center">
        <p className="text-xs text-zinc-300">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[#ffa3b9] hover:underline"
          >
            Create one now!
          </Link>
        </p>
      </div>
    </form>
  );
}
