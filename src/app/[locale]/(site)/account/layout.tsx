import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { AccountSettingsSidebar } from "@/features/account-settings/layout/account-settings-sidebar";

interface AccountSettingsLayoutProps {
  children: ReactNode;
}

export default async function AccountSettingsLayout({
  children,
}: AccountSettingsLayoutProps) {
  const t = await getTranslations("accountSettings");

  return (
    <div className="container py-15.5">
      <div className="mb-8">
        <h1 className="text-text-plain text-2xl font-bold tracking-tight sm:text-3xl">
          {t("title")}
        </h1>
      </div>

      <div className="flex flex-row gap-6">
        <AccountSettingsSidebar />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
