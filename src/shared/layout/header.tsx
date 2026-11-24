import Image from "next/image";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/shared/components/locale-switcher";
import { NavBar } from "./navbar";
import { MobileNav } from "./mobile-nav";
import { NotificationsMenu } from "@/features/notifications/components/notifications-menu";
import { NotificationToggle } from "@/features/notifications/components/notification-toggle";
import { Input } from "@/shared/ui/input";
import { SearchBar } from "@/features/search/components/searchBar";
import AuthMenu from "../components/auth-menu";
import { ThemeMode } from "../components/theme-mode";
import CartCount from "@/features/cart/components/cart-count";

const ICON_BUTTON =
  "text-zinc-700 relative flex size-9 shrink-0 items-center justify-center rounded-md transition-colors dark:text-text-plain";

export function Header() {
  const t = useTranslations("Header");

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-background dark:bg-bg-subtle">
        <div className="mx-auto flex w-full flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:gap-6 lg:px-8">
          {/* Menu + Logo */}
          <div className="flex shrink-0 items-center gap-1">
            <MobileNav />

            <Link href="/" className="shrink-0">
              <Image
                src="/images/logo.png"
                alt="Rose"
                width={64}
                height={64}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
          </div>

          {/* Search */}
          <div className="order-last w-full min-w-0 basis-full lg:order-0 lg:flex-1 lg:basis-auto">
            <Suspense
              fallback={
                <div className="h-11 w-full">
                  <Input
                    type="search"
                    placeholder={t("searchPlaceholder")}
                    aria-label={t("searchLabel")}
                    autoComplete="off"
                    className="h-11 w-full rounded-lg text-sm"
                  />
                </div>
              }
            >
              <SearchBar />
            </Suspense>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center justify-center gap-2 sm:gap-4">
            <AuthMenu loginLabel={t("login")} />

            {/* Icons */}
            <div className="border-border flex items-center gap-0.5 border-s ps-2 sm:gap-1 sm:ps-4">
              <Link
                href="/wishlist"
                aria-label={t("wishlist")}
                className={ICON_BUTTON}
              >
                <HeartIcon className="size-5" />
              </Link>

              <Link href="/cart" aria-label={t("cart")} className={ICON_BUTTON}>
                <ShoppingCartIcon className="size-5" />
                <CartCount />
              </Link>

              <NotificationsMenu label={t("notifications")} />
              <NotificationToggle />
            </div>

            <div className="border-border flex items-center gap-2 border-s py-1.5 ps-2 sm:ps-4">
              <LocaleSwitcher />
            </div>

            <div className="border-border flex items-center gap-2 border-s ps-2 sm:ps-4">
              <ThemeMode />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation (desktop strip, hidden below lg) */}
      <NavBar />
    </header>
  );
}
