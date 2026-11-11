import {
  LEGAL_LINKS,
  MAIN_LINKS,
} from "@/shared/lib/constants/navigation.constant";
import NewsletterForm from "@/features/newsletter/components/newsletter-form";
import { Link } from "@/i18n/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import Image from "next/image";

const FOOTER_LINKS = [...MAIN_LINKS, ...LEGAL_LINKS];

export default function Footer() {
  //Translations
  const format = useFormatter();
  const local = useLocale();
  const year = format.number(new Date().getFullYear(), {
    useGrouping: false,
    numberingSystem: local === "ar" ? "arab" : "latn",
  });
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");
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
                  numberingSystem: local === "ar" ? "arab" : "latn",
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
