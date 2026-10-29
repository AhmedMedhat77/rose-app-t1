import Image from "next/image";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher";

import { Link } from "@/i18n/navigation";
import { NavBar } from "./nav-bar";
import {
  BellIcon,
  HeartIcon,
  Search,
  ShoppingCartIcon,
  User,
} from "lucide-react";

const ICON_BUTTON =
  "text-foreground hover:text-primary flex size-9 items-center justify-center rounded-md transition-colors";

export function Header() {
  const t = useTranslations("Header");

  return (
    <header>
      {/* Top bar */}
      <div className="bg-background">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo 1.png"
              alt="Rose"
              width={64}
              height={64}
              priority
            />
          </Link>

          <div className="relative min-w-0 flex-1">
            <Search className="text-muted-foreground pointer-events-none absolute inset-y-0 start-3 my-auto size-4" />
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchLabel")}
              className="border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11 w-full rounded-lg border bg-transparent ps-10 pe-4 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <Link
              href="/login"
              className="text-foreground hover:text-primary flex items-center gap-2 text-sm transition-colors"
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
              <button
                type="button"
                aria-label={t("notifications")}
                className={ICON_BUTTON}
              >
                <BellIcon />
              </button>
            </div>

            <div className="border-border flex items-center gap-2 border-s ps-4">
              <LocaleSwitcher />

              {/* <ThemeSwitcher /> */}
            </div>
          </div>
        </div>
      </div>

      <NavBar />
    </header>
  );
}
