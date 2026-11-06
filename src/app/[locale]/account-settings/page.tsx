import { Suspense } from "react";
import { ChangePasswordForm } from "@/features/account-settings/components/change-password-form";
import { ProfileForm } from "@/features/account-settings/components/profile-form";

interface AccountSettingsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AccountSettingsPage({
  searchParams,
}: AccountSettingsPageProps) {
  return (
    <section>
      <Suspense
        fallback={<div className="bg-muted h-64 animate-pulse rounded-lg" />}
      >
        <SettingsContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function SettingsContent({ searchParams }: AccountSettingsPageProps) {
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab || "profile";

  return (
    <>
      {activeTab === "profile" && <ProfileForm />}
      {activeTab === "change-password" && <ChangePasswordForm />}
    </>
  );
}
