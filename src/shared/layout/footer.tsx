import Image from "next/image";

import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import NewsletterForm from "@/features/newsletter/components/newsletter-form";
import { Link } from "@/i18n/navigation";
import {
  LEGAL_LINKS,
  MAIN_LINKS,
} from "@/shared/lib/constants/navigation.constant";
import { getCurrentYear } from "@/shared/lib/utils/time.util";

const FOOTER_LINKS = [...MAIN_LINKS, ...LEGAL_LINKS];

export default async function Footer() {
  // Translations
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Navigation");
  const format = await getFormatter();
  const locale = await getLocale();

  const year = await getCurrentYear(locale);
  return (
    <footer className="bg-bg-inverse dark:bg-bg-muted px-20 py-10 text-zinc-100">
      <div className="flex flex-wrap gap-4">
        {/* Brand */}
        <div className="flex flex-col justify-center">
          <Image
            src="/images/logo.png"
            alt="Rose"
            width={240}
            height={225}
            className="h-auto w-60"
          />
          <p className="text-soft-pink-300 m-auto text-[18px]">{t("brand")}</p>
          <p className="m-auto text-[14px] text-zinc-100">
            {t("rights", { year })}
          </p>
        </div>
        <div className="flex flex-1 flex-wrap justify-between px-4">
          {/* Links */}

          <nav className="flex flex-col items-start">
            <h2 className="text-soft-pink-300 text-[18px]">{t("discover")}</h2>
            <ul>
              {FOOTER_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} className="text-[16px] hover:underline">
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {/* Newsletter */}
          <div className="px-4">
            <h2 className="text-soft-pink-300 text-[20px]">
              {t.rich("newsletterTitle", {
                percent: format.number(0.2, {
                  style: "percent",
                  numberingSystem: locale === "ar" ? "arab" : "latn",
                }),
                highlight: (chunks) => (
                  <span className="text-white">{chunks}</span>
                ),
              })}
            </h2>
            <p className="text-color-zinc-500 text-[15px]">
              {t("newsletterSubtitle")}
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </footer>
  );
}
