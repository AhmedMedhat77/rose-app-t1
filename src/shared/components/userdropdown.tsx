"use client";

import {
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MapPin,
  UserRound,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import FormDivider from "@/features/auth/components/shared/form-divider";

interface UserDropdownProps {
  showDashboard?: boolean;
}

export default function UserDropdown({
  showDashboard = false,
}: UserDropdownProps) {
  const t = useTranslations("UserDropdown");
  const { data: session } = useSession();

  const firstName = session?.user?.firstName ?? t("myAccount");
  const fullName =
    `${firstName ?? ""} ${session?.user?.lastName ?? ""}`.trim() ||
    t("myAccount");
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            type="button"
            className="hover:bg-transparent"
          />
        }
      >
        <span className="flex flex-col items-start">
          <p className="text-text-soft text-xs font-normal">{t("hello")}</p>
          <p className="text-primary max-w-40 truncate text-base font-semibold">
            {firstName}
          </p>
        </span>

        <ChevronDown
          aria-hidden="true"
          className="text-text-soft size-4.5 shrink-0"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="border-border-subtle w-60 min-w-60 rounded-[12px] border p-0"
      >
        <DropdownMenuGroup className="p-1.25">
          <DropdownMenuLabel className="text-text-primary px-2 py-1.5 text-sm font-semibold">
            {fullName}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <FormDivider />

        <DropdownMenuGroup className="p-1.25">
          <DropdownMenuItem
            render={<Link href="/account" />}
            className="text-text-plain gap-2 px-2 py-1.5 text-sm font-medium"
          >
            <UserRound aria-hidden="true" className="size-4" />
            <span>{t("account")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/addresses" />}
            className="text-text-plain gap-2 px-2 py-1.5 text-sm font-medium"
          >
            <MapPin aria-hidden="true" className="size-4" />
            <span>{t("addresses")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/orders" />}
            className="text-text-plain gap-2 px-2 py-1.5 text-sm font-medium"
          >
            <ClipboardList aria-hidden="true" className="size-4" />
            <span>{t("orders")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {showDashboard && (
          <>
            <FormDivider />
            <DropdownMenuGroup className="p-1.25">
              <DropdownMenuItem
                render={<Link href="/dashboard" />}
                className="text-text-plain gap-2 px-2 py-1.5 text-sm font-medium"
              >
                <LayoutDashboard aria-hidden="true" className="size-4" />
                <span>{t("dashboard")}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        <FormDivider />
        <DropdownMenuGroup className="p-1.25">
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-text-plain gap-2 px-2 py-1.5 text-sm font-medium"
          >
            <LogOut aria-hidden="true" className="size-4 rtl:rotate-180" />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
