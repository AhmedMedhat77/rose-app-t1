import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";

import { cn } from "cn";
import { HeroBadge } from "./hero-badge";
import { HeroSlider } from "./hero-slider";
import { CARDS } from "../../constants/hero";

const OVERLAY =
  "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent";
const LIGHT_BUTTON = "w-fit bg-red-50 text-red-800 hover:bg-red-100";
export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="container flex flex-col gap-6 py-4 pt-11 pb-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_3fr]">
        <div className="text-text-inverse dark:text-secondary-foreground relative h-110 overflow-hidden rounded-2xl">
          <Image
            src="/images/red-gifts.png"
            alt=""
            fill
            className="h-110 object-cover"
          />
          <div className={OVERLAY} />
          <div className="absolute inset-0 flex flex-col justify-end gap-3 p-5">
            <HeroBadge>{t("side.badge")}</HeroBadge>
            <h2 className="text-2xl font-semibold">{t("side.title")}</h2>
            <Button
              size="sm"
              type="button"

              className={cn(LIGHT_BUTTON, "h-9 w-[8.12rem]")}
            >
              {t("side.button")}
              <ArrowRight className="rtl:rotate-180" />
            </Button>
          </div>
        </div>
        <HeroSlider />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <div
            key={card.id}
            className="text-text-inverse dark:text-secondary-foreground relative h-[16.9rem] overflow-hidden rounded-2xl"
          >
            <Image src={card.image} alt="" fill className="object-cover" />
            <div className={OVERLAY} />
            <div className="absolute inset-0 flex flex-col justify-end gap-2 p-4">
              <HeroBadge>{t(`cards.${card.id}.badge`)}</HeroBadge>
              <h3 className="text-lg leading-tight font-semibold">
                {t(`cards.${card.id}.title`)}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
