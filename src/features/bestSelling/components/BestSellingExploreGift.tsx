"use client";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function BestSellingExploreGift() {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <div className="font-primary flex h-[22.4rem] w-[18.18rem] flex-col justify-between align-middle text-[30px] leading-none font-bold tracking-normal">
      <div>
        <p className="text-text-secondary font-primary h-[1.9rem] w-[18.18rem] align-middle text-[16px] leading-none font-bold tracking-[25%] uppercase">
          {t("bestSelling.label")}
        </p>
        <p className="text-text-primary pb-2 leading-[120%]">
          <span className="text-text-secondary">
            {t("bestSelling.title.highlight")}
          </span>{" "}
          {t("bestSelling.title.text")}{" "}
          <span className="text-text-secondary">
            {t("bestSelling.title.chosen")}
          </span>{" "}
          {t("bestSelling.title.now")}
        </p>
        <p className="font-primary align-middle text-[16px] leading-[120%] font-normal tracking-normal text-zinc-500">
          {t("bestSelling.description")}
        </p>
      </div>

      <Button className="text-text-inverse bg-bg-maron-secondary w-fit">
        <Link href="/products" className="align-items flex justify-between">
          {" "}
          <p className=""> {t("bestSelling.exploreGift")} </p>{" "}
          {locale === "ar" ? (
            <ArrowLeftIcon className="translate-y-[25%]" />
          ) : (
            <ArrowRightIcon className="translate-y-[25%]" />
          )}{" "}
        </Link>
      </Button>
    </div>
  );
}
