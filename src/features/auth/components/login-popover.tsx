"use client";

import { useState, useRef } from "react";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

import LoginPopoverForm from "./login-popover-form";

const TRIGGER_CLASS =
  "text-foreground hover:text-primary flex items-center gap-2 text-sm transition-colors";

export default function LoginPopover({ label }: { label: string }) {
  const t = useTranslations("LoginPopover");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = (
    <>
      <User aria-hidden="true" width={20} height={20} />
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

  const closeAfter = (delay: number) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(false), delay);
  };

  const handleTriggerMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpen(true);
  };

  const handleTriggerMouseLeave = () => {
    closeAfter(1000); // يبقى مفتوح 1000ms بعد خروج الفأرة من الزر
  };

  const handleContentMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpen(true);
  };

  const handleContentMouseLeave = () => {
    closeAfter(1000); // يبقى مفتوح 1000ms بعد خروج الفأرة من المحتوى
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <button
          type="button"
          className={TRIGGER_CLASS}
          onMouseEnter={handleTriggerMouseEnter}
          onMouseLeave={handleTriggerMouseLeave}
        >
          {trigger}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-96 gap-0 overflow-hidden p-0"
        onMouseEnter={handleContentMouseEnter}
        onMouseLeave={handleContentMouseLeave}
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
