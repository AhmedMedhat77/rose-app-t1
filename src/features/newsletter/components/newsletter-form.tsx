"use client";

import { useForm } from "react-hook-form";
import { INewsLetterFormValues } from "../types/newsletter";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema } from "../schema/schema";
import { useTranslations } from "next-intl";

export default function NewsletterForm() {
  //Translation
  const t = useTranslations("Footer");
  //Form
  const { handleSubmit, register, formState } = useForm<INewsLetterFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(newsletterSchema(t)),
  });

  //Submit Function
  const onSubmit = (data: INewsLetterFormValues) => {
    console.log(data);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2"
    >
      <div className="relative">
        {/* TODO: استبدليه بـ Input component لما عبدالرحمن يخلصه */}
        <input
          type="email"
          placeholder={t("emailPlaceholder")}
          aria-label={t("emailPlaceholder")}
          //aria-invalid={!!errors.email}
          className="focus-visible:ring-soft-pink-300 h-14 w-full rounded-full bg-zinc-600 ps-6 pe-40 text-base text-white placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:outline-none"
          {...register("email")}
        />

        {/* TODO: استبدليه بـ Button component */}
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="bg-maroon-50 text-maroon-700 hover:bg-maroon-100 focus-visible:ring-soft-pink-300 absolute inset-y-0 end-0 flex items-center gap-3 rounded-full px-6 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("subscribe")}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5 rtl:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {/* {errors.email && (
        <p role="alert" className="ps-6 text-sm text-red-400">
          {errors.email.message}
        </p>
      )} */}

      {/* TODO: استبدليه بـ Toast لما رضوى تخلصه */}
      {/* {result && (
        <p role="status" className="ps-6 text-sm text-white">
          {resultMessage[result]}
        </p>
      )} */}
    </form>
  );
}
