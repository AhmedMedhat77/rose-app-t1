"use client";

import PopularLabel from "@/shared/components/popularLabel";
import { useTranslations, useLocale } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MostPopularProps } from "../types/mostPopular";
import { useState } from "react";
import useMostPopular from "../hooks/use-most-popular";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import ProductCard from "@/shared/components/ProductCard";

export default function MostPopular({
  occasions,
  initialProducts,
  initialOccasionId,
}: MostPopularProps) {
  const t = useTranslations();
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [selectedOccasionId, setSelectedOccasionId] =
    useState(initialOccasionId);

  const {
    data: products = [],
    isLoading,
    isError,
  } = useMostPopular({
    occasionId: selectedOccasionId,
    initialOccasionId,
    initialProducts,
  });

  return (
    <div className="my-20">
      <div className="mx-auto my-15 w-[80rem]">
        <div className="flex items-center justify-between">
          <PopularLabel className="font-primary align-middle text-[36px] leading-none font-bold tracking-normal">
            {t("mostPopular.label")}
          </PopularLabel>

          <Tabs
            value={selectedOccasionId}
            onValueChange={setSelectedOccasionId}
            className="w-fit"
          >
            <TabsList variant="line">
              {occasions.map((occasion) => (
                <TabsTrigger value={occasion.id} key={occasion.id}>
                  {occasion.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div dir={dir} className="w-full min-w-0">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading && <p>Loading products...</p>}

          {isError && <p>Failed to load products.</p>}

          {!isLoading &&
            !isError &&
            products.map((ele) => (
              <ProductCard key={ele.id} product={ele} variant="mostPopular" />
            ))}

          {!isLoading && !isError && products.length === 0 && (
            <p>No products found for this category.</p>
          )}
        </div>

        <div className="text-text-maron-700 mt-8 flex justify-end">
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "text-text-maroon-700 hover:text-text-maroon-700 border-0 hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent",
            )}
          >
            <span> {t("ViewMore.ViewMore")} </span>
            {locale === "ar" ? (
              <ArrowLeftIcon className="translate-y-[15%]" />
            ) : (
              <ArrowRightIcon className="translate-y-[15%]" />
            )}{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}
