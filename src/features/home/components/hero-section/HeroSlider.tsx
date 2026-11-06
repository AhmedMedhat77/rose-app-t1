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
} from "@/components/ui/carousel";
import { cn } from "cn";
import { SLIDES } from "../../constants/hero";
const LIGHT_BUTTON = "w-fit bg-red-50 text-red-800 hover:bg-red-100";
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
            <div className="relative h-110 overflow-hidden rounded-2xl text-white">
              <Image
                src={slide.image}
                alt={t(`slides.${slide.id}.title`)}
                fill
                priority={i === 0}
                className="h-[27.4rem] object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent rtl:bg-linear-to-l" />
              <div className="absolute inset-y-0 inset-s-9 flex translate-y-30 flex-col justify-center gap-2">
                <h2 className="text-4xl font-semibold">
                  {t(`slides.${slide.id}.title`)}
                </h2>
                <p className="h-12 text-[16px]">
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

      <div className="absolute inset-e-6 top-5 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => api?.scrollTo(i)}
            aria-label={`${i + 1}`}
            className={`h-1.5 rounded-full ${i === current ? "w-6 bg-red-700" : "w-1.5 bg-white"}`}
          />
        ))}
      </div>

      <div className="absolute inset-e-6 bottom-5 flex h-[2.18rem] w-[4.6rem] gap-1 rounded-full bg-white p-1">
        <Button
          size="icon"
          onClick={() => api?.scrollPrev()}
          aria-label="prev"
          className={cn(LIGHT_BUTTON, "h-[1.8rem] w-[1.8rem]")}
        >
          <ChevronLeft className="rtl:rotate-180" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => api?.scrollNext()}
          aria-label="next"
          className={cn(LIGHT_BUTTON, "h-[1.8rem] w-[1.8rem]")}
        >
          <ChevronRight className="rtl:rotate-180" />
        </Button>
      </div>
    </Carousel>
  );
}
