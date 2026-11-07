import PopularLabel from "@/shared/components/popularLabel";
import { useTranslations } from "next-intl";
import React from "react";

export default function TestimonialsTitle() {
  const t = useTranslations();

  return (
    <div className="text-text-maron mt-20 mb-10 flex flex-col items-center justify-center gap-4">
      <p>{t("Testimonials.label")}</p>
      <PopularLabel className="font-primary align-middle text-[36px] leading-none font-bold tracking-normal">
        {t("Testimonials.text")}
      </PopularLabel>
    </div>
  );
}
