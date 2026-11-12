import { Suspense } from "react";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { ChangePasswordForm } from "@/features/account-settings/components/change-password-form";
import { ProfileForm } from "@/features/account-settings/components/profile-form";
import { ProfileLoadError } from "@/features/account-settings/components/profile-load-error";
import { getProfile } from "@/features/account-settings/lib/apis/profile.api";
import { ProfileFormSkeleton } from "@/features/account-settings/skeletons/profile-form-skeleton";
import { redirect } from "@/i18n/navigation";

interface AccountSettingsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default function AccountSettingsPage({
  params,
  searchParams,
}: AccountSettingsPageProps) {
  return (
    <section>
      <Suspense fallback={<ProfileFormSkeleton />}>
        <AccountSettingsContent params={params} searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function AccountSettingsContent({
  params,
  searchParams,
}: AccountSettingsPageProps) {
  const { locale } = await params;
  const { tab } = await searchParams;
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  const userId = session?.user?.id;

  if (!accessToken || !userId) {
    redirect({ href: "/login", locale });
    return null;
  }

  if (tab === "change-password") {
    return <ChangePasswordForm />;
  }

  const profile = await getProfile(accessToken, userId).catch(() => null);
  if (!profile) return <ProfileLoadError />;

  return <ProfileForm profile={profile} />;
}
