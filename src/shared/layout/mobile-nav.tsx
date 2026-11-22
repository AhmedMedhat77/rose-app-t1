"use client";

import { MenuIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { MAIN_LINKS } from "@/shared/lib/constants/navigation.constant";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { cn } from "cn";

import { isActiveNavLink, NAV_ICONS } from "./nav-shared";

export function MobileNav({ children }: { children?: ReactNode }) {
  // Translation
  const tNav = useTranslations("Navigation");
  const t = useTranslations("Header");
  const isArabic = useLocale() === "ar";

  // Navigation
  const pathname = usePathname();

  // State
  const [openAt, setOpenAt] = useState<string | null>(null);

  // Variables
  const open = openAt === pathname;

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => setOpenAt(next ? pathname : null)}
    >
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label={t("openMenu")}
            className="lg:hidden"
          />
        }
      >
        <MenuIcon aria-hidden="true" className="size-6" />
      </SheetTrigger>

      <SheetContent
        side={isArabic ? "right" : "left"}
        className="w-72 gap-0 p-0 lg:hidden"
      >
        <SheetHeader className="border-border-muted border-b p-4">
          <SheetTitle>{t("menu")}</SheetTitle>
          <SheetDescription className="sr-only">
            {t("menuDescription")}
          </SheetDescription>
        </SheetHeader>

        <nav aria-label={t("mainNavigation")}>
          <ul className="flex flex-col gap-1 p-3">
            {MAIN_LINKS.map(({ key, href }) => {
              const active = isActiveNavLink(pathname, href);

              return (
                <li key={key}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenAt(null)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                      active
                        ? "bg-bg-primary-saturated dark:text-text-inverse text-zinc-50"
                        : "text-text-plain hover:bg-bg-muted",
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
        {children && (
          <div className="border-border-muted mt-auto flex flex-col gap-4 border-t p-4">
            {children}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
