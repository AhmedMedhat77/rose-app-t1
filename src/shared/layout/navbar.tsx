"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { MAIN_LINKS } from "@/shared/lib/constants/navigation.constant";
import { cn } from "cn";

import { isActiveNavLink, NAV_ICONS } from "./nav-shared";

export function NavBar() {
  // Translation
  const tNav = useTranslations("Navigation");
  const t = useTranslations("Header");

  // Navigation
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("mainNavigation")}
      className="bg-bg-primary-saturated hidden lg:block"
    >
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-1 px-6">
        {MAIN_LINKS.map(({ key, href }) => {
          const active = isActiveNavLink(pathname, href);

          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 border-b-2 py-3 text-[16px] transition-colors hover:opacity-80",
                  active
                    ? "text-soft-pink-200 dark:text-text-inverse"
                    : "dark:text-text-inverse border-transparent text-zinc-50",
                )}
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
