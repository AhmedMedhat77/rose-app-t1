"use client";
import { useTranslations, useLocale } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { MostPopularProps } from "../types/mostPopular";
import { useState } from "react";
import useMostPopular from "../hooks/use-most-popular";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "cn";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import ProductCard from "@/shared/components/product-card";
import SectionsTitle from "@/shared/components/SectionsTitle";

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
    <div className="container my-20">
      <div className="mx-auto my-15 w-7xl">
        <div className="flex items-center justify-between">
          <SectionsTitle mainTitle={`${t("mostPopular.label")}`} />
          <Tabs
            value={selectedOccasionId}
            onValueChange={setSelectedOccasionId}
            className="w-fit"
          >
            <TabsList>
              {occasions.map((occasion) => (
                <TabsTrigger
                  className={cn(
                    "hover:bg-bg-muted dark:text-text-muted bg-bg-plain dark:bg-bg-subtle border-0",
                    // Active (selected) styles
                    "data-active:bg-bg-plain data-active:text-text-maroon",
                    "data-active:dark:bg-bg-subtle",
                    "data-active:hover:bg-bg-muted",
                    // Disabled
                    "data-disabled:bg-bg-muted data-disabled:text-text-muted",
                  )}
                  value={occasion.id}
                  key={occasion.id}
                >
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

        <div className="text-text-maroon-700 mt-8 flex justify-end">
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
