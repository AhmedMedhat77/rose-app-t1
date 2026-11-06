"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { UserRoundPen, Lock, LogOut } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { cn } from "cn";
import { TOAST_STATE } from "@/shared/lib/constants/toast-states.constant";
import { addToast } from "@/shared/ui/toast";

function SidebarContent() {
  const t = useTranslations("accountSettings");
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "profile";

  const navItems = [
    {
      id: "profile",
      label: t("sidebar.profile"),
      icon: UserRoundPen,
      href: { pathname: "/account-settings", query: { tab: "profile" } },
    },
    {
      id: "change-password",
      label: t("sidebar.changePassword"),
      icon: Lock,
      href: {
        pathname: "/account-settings",
        query: { tab: "change-password" },
      },
    },
  ];

  const handleLogout = async () => {
    // TODO: Implement logout logic and navigate back to home page
    addToast(TOAST_STATE.Successful, t("toasts.logoutSuccess"));
  };

  return (
    <aside className="bg-bg-subtle border-border-muted flex h-full min-h-[720px] w-75 flex-col justify-between rounded-lg border p-4">
      {/* Top Navigation Items */}
      <nav className="flex flex-col gap-[10px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                  : "hover:bg-muted text-zinc-800 dark:text-zinc-200",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Logout Action */}
      <div className="mt-auto">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="bg-bg-muted h-11 w-full justify-start gap-2.5 rounded-sm px-4 py-3 text-red-600 dark:text-red-400"
        >
          <LogOut className="h-5 w-5 shrink-0 text-red-600 ltr:rotate-180 dark:text-red-400" />
          <span className="font-medium">{t("sidebar.logout")}</span>
        </Button>
      </div>
    </aside>
  );
}

export function AccountSettingsSidebar() {
  return (
    <Suspense
      fallback={
        <div className="bg-muted h-[720px] w-full animate-pulse rounded-lg border md:w-[299px]" />
      }
    >
      <SidebarContent />
    </Suspense>
  );
}
