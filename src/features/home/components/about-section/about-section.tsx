import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import AboutImages from "./about-images";
import { Button } from "@/shared/ui/button";

const FEATURES = ["prices", "quality", "occasion", "delivery"] as const;
export default function AboutSection() {
  const t = useTranslations("About");

  return (
    <section className="mx-auto flex max-w-7xl flex-wrap items-center gap-10 px-6 py-16">
      <AboutImages />

      <div className="min-w-80 flex-1">
        <p className="text-soft-pink-500 dark:text-maroon-400 text-sm font-medium tracking-[0.3em]">
          {t("label")}
        </p>

        <h2 className="text-maroon-700 dark:text-soft-pink-200 mt-3 text-3xl font-bold">
          {t("titleStart")}{" "}
          <span className="text-soft-pink-500 dark:text-maroon-400">
            {t("titleHighlight1")}
          </span>{" "}
          {t("titleMiddle")}{" "}
          <span className="text-soft-pink-500 dark:text-maroon-400">
            {t("titleHighlight2")}
          </span>{" "}
          {t("titleEnd")}
        </h2>

        <p className="text-text-soft dark:text-text-muted mt-3 text-base">
          {t("description")}
        </p>
        <Button
          render={<Link href="/products" />}
          nativeButton={false}
          className="dark:bg-bg-primary-saturated mt-6 h-9 gap-2.5 rounded-xl px-4 py-2.5 text-sm"
        >
          {t("discover")}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Button>

        <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {FEATURES.map((key) => (
            <li
              key={key}
              className="text-text-plain flex items-center gap-3 text-sm"
            >
              <Check className="text-maroon-700 size-5 shrink-0" />
              {t(`features.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
