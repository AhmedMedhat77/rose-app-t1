import { Suspense } from "react";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { ChangePasswordForm } from "@/features/account-settings/components/change-password-form";
import { ProfileForm } from "@/features/account-settings/components/profile-form";
import { getProfile } from "@/features/account-settings/lib/apis/profile.api";
import { ProfileFormSkeleton } from "@/features/account-settings/skeletons/profile-form-skeleton";
import { redirect } from "@/i18n/navigation";

interface AccountSettingsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function AccountSettingsPage({
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
    return (
      <section>
        <ChangePasswordForm />
      </section>
    );
  }

  return (
    <section>
      <Suspense fallback={<ProfileFormSkeleton />}>
        <ProfileSection accessToken={accessToken} userId={userId} />
      </Suspense>
    </section>
  );
}

async function ProfileSection({
  accessToken,
  userId,
}: {
  accessToken: string;
  userId: string;
}) {
  const profile = await getProfile(accessToken, userId);

  return <ProfileForm profile={profile} />;
}
