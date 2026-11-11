"use client";

import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

import LoginPopoverForm from "./login-popover-form";

const TRIGGER_CLASS =
  "text-text-plain hover:text-text-primary flex items-center gap-1  transition-colors";

const CLOSE_DELAY_MS = 1000;

export default function LoginPopover({ label }: { label: string }) {
  const t = useTranslations("LoginPopover");
  const pathname = usePathname();

  // الـ popover مفتوح بس طول ما إحنا في نفس الصفحة اللي اتفتح فيها،
  // فلما الصفحة تتغير بيتقفل لوحده
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (next: boolean) => setOpenAt(next ? pathname : null);

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // نمسح الـ timer لو الـ component اتشال
  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  const trigger = (
    <>
      <User aria-hidden="true" size={20} />
      {label}
    </>
  );

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.endsWith("/login") ||
    pathname.endsWith("/register") ||
    pathname.endsWith("/forgot-password");

  if (isAuthPage) {
    return (
      <Link href="/login" className={TRIGGER_CLASS}>
        {trigger}
      </Link>
    );
  }

  const cancelClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const openNow = () => {
    cancelClose();
    setOpen(true);
  };

  const closeLater = () => {
    cancelClose();
    hoverTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={
          <Link
            href="/login"
            className={TRIGGER_CLASS}
            onMouseEnter={openNow}
            onMouseLeave={closeLater}
            onClick={() => {
              cancelClose();
              setOpen(false);
            }}
          />
        }
      >
        {trigger}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-96 gap-0 overflow-hidden p-0"
        onMouseEnter={openNow}
        onMouseLeave={closeLater}
      >
        <nav aria-label={t("tabsLabel")} className="grid grid-cols-2">
          <span
            aria-current="page"
            className="bg-primary text-primary-foreground py-3 text-center text-sm font-medium"
          >
            {t("login")}
          </span>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="bg-muted text-foreground hover:bg-muted/70 py-3 text-center text-sm font-medium transition-colors"
          >
            {t("register")}
          </Link>
        </nav>

        <LoginPopoverForm />
      </PopoverContent>
    </Popover>
  );
}
