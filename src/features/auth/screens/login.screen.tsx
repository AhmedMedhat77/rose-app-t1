"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TLoginFormValues } from "@/features/auth/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schemas/login.schema";
import { startTransition } from "react";

export function LoginScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<TLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = handleSubmit(async (values) => {
    console.log(values);
    const response = await signIn("credentials", {
      ...values,
      // close next auth redirect to show errors
      redirect: false,
    });

    if (response?.ok) {
      const searchParams = new URLSearchParams();
      // to redirect user to his prev screen or home screen
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      // hard redirect
      startTransition(() => {
        location.href = callbackUrl;
      });
    }
    if (!response?.ok) {
      setError("root", {
        message: response?.error || "Something went wrong",
      });
    }
  });
  return (
    <div className="flex flex-1 items-center justify-center">
      <form noValidate onSubmit={onSubmit} className="mx-auto grid w-5xl gap-5">
        <h1>Login Form</h1>
        <Input type="email" title="Email" {...register("email")} />
        <span>{errors.email?.message}</span>
        <Input type="password" title="password" {...register("password")} />
        <span>{errors.password?.message}</span>
        <Button type="submit">Submit</Button>
        {errors.root && <p>{errors.root.message}</p>}
      </form>
    </div>
  );
}

export default LoginScreen;
