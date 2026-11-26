import { getTranslations, getLocale } from "next-intl/server";

import SectionsTitle from "@/shared/components/SectionsTitle";
import { buttonVariants } from "@/shared/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "cn";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import getAllOccasions from "../lib/api-occasions";
import MostPopularTabs from "./most-popular-tabes";
import MostPopularProducts from "./most-popular-products";

type Props = {
  occasionId?: string;
};

export default async function MostPopular({ occasionId }: Props) {
  const t = await getTranslations();
  const locale = await getLocale();

  const occasions = await getAllOccasions();

  const initialOccasionId = occasions?.[0]?.id ?? "";

  const selectedOccasionId = occasions?.some(
    (occasion) => occasion.id === occasionId,
  )
    ? occasionId!
    : initialOccasionId;

  return (
    <section className="container my-20">
      <MostPopularTabs
        occasions={occasions}
        selectedOccasionId={selectedOccasionId}
        sectionTitle={<SectionsTitle mainTitle={t("mostPopular.label")} />}
      />

      <MostPopularProducts occasionId={selectedOccasionId} />

      <div className="text-text-maroon-700 mt-8 flex justify-end">
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "text-text-maroon-700 hover:text-text-maroon-700 border-0 hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent",
          )}
        >
          <span>{t("ViewMore.ViewMore")}</span>

          {locale === "ar" ? <ArrowLeftIcon /> : <ArrowRightIcon />}
        </Link>
      </div>
    </section>
  );
}
