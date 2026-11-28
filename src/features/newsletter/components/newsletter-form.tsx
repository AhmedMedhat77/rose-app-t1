"use client";

import { useForm } from "react-hook-form";
import { INewsLetterFormValues } from "../lib/types/newsletter";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema } from "../lib/schemas/newsletter.schema";
import { useTranslations } from "next-intl";
import { useSubscribe } from "../hooks/use-subscribe";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ArrowRight } from "lucide-react";
export default function NewsletterForm() {
  //Translation
  const t = useTranslations("Footer");

  const { isPending, subscribe } = useSubscribe();

  //Form
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<INewsLetterFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(newsletterSchema(t)),
  });

  //Submit Function

  const onSubmit = async ({ email }: INewsLetterFormValues) => {
    subscribe(email, {
      onSuccess: (result) => {
        if (result === "subscribed") reset();
      },
    });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="mt-5 flex flex-col gap-2"
    >
      <div className="relative">
        <Input
          type="email"
          placeholder={t("emailPlaceholder")}
          aria-label={t("emailPlaceholder")}

          className="placeholder:text-text-muted h-12 w-full rounded-full bg-zinc-600 ps-6 pe-40 text-base text-white focus-visible:ring-2 focus-visible:outline-none"
          {...register("email")}
        />

        <Button
          type="submit"
          variant="secondary"
          disabled={isPending}
          loading={isPending}
          className="dark:bg-bg-primary dark:text-text-inverse absolute inset-y-0 inset-e-0 flex h-full items-center gap-3 rounded-full px-6"
        >
          {t("subscribe")}
          <ArrowRight className="rtl:rotate-180" />
        </Button>
      </div>

      {errors.email && (
        <p role="alert" className="ps-6 text-sm text-red-400">
          {errors.email.message}
        </p>
      )}
    </form>
  );
}
