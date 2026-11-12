import Image from "next/image";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/shared/components/locale-switcher";
import { Link } from "@/i18n/navigation";
import { NavBar } from "./NavBar";
import { HeartIcon, ShoppingCartIcon, User } from "lucide-react";
import { NotificationsMenu } from "@/features/notifications/components/NotificationsMenu";
import { NotificationToggle } from "@/features/notifications/components/NotificationToggle";
import { Input } from "@/shared/ui/input";
import { Suspense } from "react";
import { SearchBar } from "@/features/search/components/searchBar";

const ICON_BUTTON =
  "text-zinc-700  dark:text-text-plain flex size-9 items-center justify-center rounded-md transition-colors";

export function Header() {
  const t = useTranslations("Header");

  return (
    <header>
      {/* Top bar */}
      <div className="bg-background dark:bg-bg-subtle">
        <div className="mx-auto flex items-center gap-6 px-6 py-3">
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

          <div className="relative flex-1">
            <Suspense
              fallback={
                <div className="h-11 flex-1">
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

          <div className="flex shrink-0 items-center gap-4">
            <Link
              href="/login"
              className="dark:text-text-plain flex items-center gap-2 text-sm text-[16px] text-zinc-700 transition-colors"
            >
              <User width={20} height={20} />
              {t("login")}
            </Link>

            <div className="border-border flex items-center gap-1 border-s ps-4">
              <Link
                href="/wishlist"
                aria-label={t("wishlist")}
                className={ICON_BUTTON}
              >
                <HeartIcon />
              </Link>
              <Link href="/cart" aria-label={t("cart")} className={ICON_BUTTON}>
                <ShoppingCartIcon />
              </Link>

              <NotificationsMenu label={t("notifications")} />
              <NotificationToggle />
            </div>

            <div className="border-border flex items-center gap-2 border-s ps-4">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </header>
  );
}
