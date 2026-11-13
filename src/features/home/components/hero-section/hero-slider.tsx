"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/shared/ui/carousel";
import { cn } from "cn";
import { SLIDES } from "../../constants/hero";
const LIGHT_BUTTON =
  "w-fit bg-bg-danger-fade text-red-800 hover:bg-bg-danger-faint dark:bg-maroon-50";
export function HeroSlider() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true, direction: locale === "ar" ? "rtl" : "ltr" }}
      className="relative"
    >
      <CarouselContent>
        {SLIDES.map((slide, i) => (
          <CarouselItem key={slide.id}>
            <div className="text-text-inverse dark:text-secondary-foreground relative h-110 overflow-hidden rounded-2xl">
              <Image
                src={slide.image}
                alt={t(`slides.${slide.id}.title`)}
                fill
                priority={i === 0}
                className="h-[27.4rem] object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent rtl:bg-linear-to-l" />
              <div className="absolute inset-y-0 inset-s-9 flex translate-y-30 flex-col justify-center gap-2">
                <h2 className="text-4xl font-semibold">
                  {t(`slides.${slide.id}.title`)}
                </h2>
                <p className="h-12 text-[1rem]">
                  {t(`slides.${slide.id}.subtitle`)}
                </p>
                <Button
                  size="sm"

                  className={cn(LIGHT_BUTTON, "h-9 w-[8.12rem]")}
                >
                  {t("buy")}
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="absolute inset-e-8 top-7 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => api?.scrollTo(i)}
            aria-label={`${i + 1}`}
            className={`h-2.5 cursor-pointer rounded-full ${i === current ? "bg-bg-danger-saturated w-9" : "bg-bg-plain w-2.5"}`}
          />
        ))}
      </div>

      <div className="bg-bg-primary-fade dark:bg-maroon-50 absolute inset-e-8 bottom-7 flex h-8.75 w-18.5 items-center justify-between rounded-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => api?.scrollPrev()}
          aria-label="prev"
          className="size-auto bg-transparent p-0 hover:bg-transparent"
        >
          <ChevronLeft className="text-maroon-700 size-7.5 rtl:rotate-180" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => api?.scrollNext()}
          aria-label="next"
          className="size-auto bg-transparent p-0 hover:bg-transparent"
        >
          <ChevronRight className="text-maroon-700 size-7.5 rtl:rotate-180" />
        </Button>
      </div>
    </Carousel>
  );
}
