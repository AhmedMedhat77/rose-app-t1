"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { MAIN_LINKS } from "@/constants/navigation";
import {
  ClipboardCheckIcon,
  GiftIcon,
  HeadsetIcon,
  HomeIcon,
  InfoIcon,
  PartyPopperIcon,
} from "lucide-react";

type MainLinkKey = (typeof MAIN_LINKS)[number]["key"];

const NAV_ICONS: Record<MainLinkKey, ReactNode> = {
  home: <HomeIcon width={20} height={20} />,
  products: <GiftIcon width={20} height={20} />,
  categories: <ClipboardCheckIcon width={20} height={20} />,
  occasions: <PartyPopperIcon width={20} height={20} />,
  contact: <HeadsetIcon width={20} height={20} />,
  about: <InfoIcon width={20} height={20} />,
};

export function NavBar() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("Header");
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav aria-label={t("mainNavigation")} className="bg-maroon-700">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-1 px-6">
        {MAIN_LINKS.map(({ key, href }) => {
          const active = isActive(href);
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`text-soft-pink-200 flex items-center gap-2 border-b-2 py-3 text-[16px] transition-colors hover:opacity-80 ${
                  active ? "border-current" : "border-transparent text-zinc-50"
                }`}
              >
                {NAV_ICONS[key]}
                {tNav(key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
