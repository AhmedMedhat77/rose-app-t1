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
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-text-plain text-2xl font-bold tracking-tight sm:text-3xl">
          {t("title")}
        </h1>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <AccountSettingsSidebar />

        <main className="min-h-[720px] flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
