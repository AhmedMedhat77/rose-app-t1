import { LEGAL_LINKS, MAIN_LINKS } from "@/constants/navigation";
import NewsletterForm from "@/features/newsletter/components/newsletter-form";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const FOOTER_LINKS = [...MAIN_LINKS, ...LEGAL_LINKS];

export default function Footer() {
  const FooterDescription = useTranslations("Footer");
  const FooterNavigation = useTranslations("Navigation");
  return (
    <footer className="bg-zinc-900 px-20 py-10 text-zinc-100">
      <div className="flex flex-wrap justify-between gap-4">
        {/* Brand */}
        <div>
          <Image src="/images/logo 1.png" alt="Rose" width={240} height={225} />
          <p className="text-soft-pink-300">{FooterDescription("brand")}</p>
          <p>{FooterDescription("rights")}</p>
        </div>
        {/* Links */}
        <nav>
          <h2 className="text-soft-pink-300">
            {FooterDescription("discover")}
          </h2>
          <ul>
            {FOOTER_LINKS.map(({ key, href }) => (
              <li key={key}>
                <Link href={href} className="hover:underline">
                  {FooterNavigation(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Newsletter */}
        <div>
          <h2 className="text-soft-pink-300">
            {FooterDescription("newsletterTitle")}
          </h2>
          <p className="text-zinc-500">
            {FooterDescription("newsletterSubtitle")}
          </p>
          <NewsletterForm />
        </div>
      </div>
    </footer>
  );
}
