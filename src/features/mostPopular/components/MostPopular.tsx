"use client";

import PopularLabel from "@/shared/components/popularLabel";
import { useTranslations, useLocale } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Product } from "../types/mostPopular";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";

export default function MostPopular({
  allProducts,
}: {
  allProducts: Product[];
}) {
  const t = useTranslations();
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [category, setCategory] = useState("wedding");

  // Filter products based on selected category
  const filteredProducts =
    allProducts?.filter((ele) =>
      ele.occasions?.some(
        (item) => item.occasion?.title?.toLowerCase() === category,
      ),
    ) ?? [];

  const occasions = [
    ...new Map(
      allProducts.flatMap((product) =>
        (product.occasions ?? [])
          .filter((item) => item.occasion?.id && item.occasion?.title)
          .map((item) => [item.occasion.id, item.occasion]),
      ),
    ).values(),
  ];

  return (
    <div className="my-20">
      <div className="mx-auto my-15 w-[80rem]">
        <div className="flex items-center justify-between">
          <PopularLabel className="font-primary align-middle text-[36px] leading-none font-bold tracking-normal">
            {t("mostPopular.label")}
          </PopularLabel>

          <Tabs value={category} onValueChange={setCategory} className="w-fit">
            <TabsList variant="line">
              {occasions?.map((ele) => (
                <TabsTrigger
                  value={`${ele.title.trim().toLowerCase()}`}
                  key={ele.id}
                >
                  {`${ele.title}`}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div dir={dir} className="w-full min-w-0">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.slice(0, 12).map((ele) => (
            <div
              key={ele.id}
              className="group flex h-[22.75rem] w-full max-w-[18.875rem] flex-col gap-4 overflow-hidden rounded-t-2xl"
            >
              <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-2xl">
                {ele.cover && (
                  <Image
                    src={ele.cover}
                    alt={ele.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                <div className="absolute end-1 top-1 z-10 flex flex-wrap justify-end gap-1">
                  {ele.stock <= 0 && (
                    <span className="rounded-sm bg-red-500 px-1.5 py-0.5 text-[8px] font-medium text-white">
                      OUT OF STOCK
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-primary text-text-maron-700 align-middle text-[18px] leading-none font-semibold tracking-normal">
                  {ele.title}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={20}
                        strokeWidth={1.5}
                        fill={
                          i < Math.round(ele.rating ?? 0) ? "#F9A825" : "none"
                        }
                        className="text-[#F9A825]"
                      />
                    ))}
                  </div>

                  <button className="bg-bg-maron translate-y-[50%] rounded-full p-2 text-white">
                    <ShoppingCart size="1.625rem" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-text-maron-700 font-primary align-bottom text-[16px] leading-none font-medium tracking-normal">
                    {ele.price} EGP
                  </span>
                  <span className="font-primary text-text-muted align-bottom text-base leading-none font-medium tracking-normal line-through">
                    {ele.discountValue &&
                      Number(ele.price) -
                        (Number(ele.price) * Number(ele.discountValue)) /
                          100}{" "}
                    {ele.discountValue && "EGP"}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <p>No products found for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}
