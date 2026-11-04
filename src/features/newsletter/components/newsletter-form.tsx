"use client";

import { useForm } from "react-hook-form";
import { INewsLetterFormValues } from "../types/newsletter";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema } from "../schema/schema";
import { useTranslations } from "next-intl";
import { SubscribeResult, subscribeToNewsletter } from "../apis/subscribe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states";
import { addToast } from "@/components/ui/toast";
import { ArrowRight } from "lucide-react";
export default function NewsletterForm() {
  //Translation
  const t = useTranslations("Footer");
  //Form
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<INewsLetterFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(newsletterSchema(t)),
  });

  //Submit Function

  const onSubmit = async ({ email }: INewsLetterFormValues) => {
    const response = await subscribeToNewsletter(email);

    const messages: Record<SubscribeResult, string> = {
      subscribed: t("subscribeSuccess"),
      "already-subscribed": t("subscribeAlready"),
      error: t("subscribeError"),
    };

    if (response === "subscribed") {
      addToast(TOAST_STATE.Successful, messages[response]);
      reset();
    } else {
      addToast(TOAST_STATE.Unsuccessful, messages[response]);
    }
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
          disabled={isSubmitting}
          loading={isSubmitting}
          className="dark:bg-bg-primary dark:text-text-inverse absolute inset-y-0 inset-e-0 flex h-full items-center gap-3 rounded-full px-6"
        >
          {t("subscribe")}
          <ArrowRight />
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
