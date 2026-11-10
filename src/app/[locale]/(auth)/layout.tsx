import FormDecorative from "@/features/auth/components/shared/form-decorative";
import { AuthLocaleToggle } from "@/shared/auth-locale-toggle";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Suspense } from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Auth");

  return (
    <main className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
      {/* Left Column */}
      <section className="relative flex min-h-screen flex-col justify-between px-6 py-6 sm:px-12 md:px-14 lg:px-20">
        {/* Center content container */}
        <div className="mx-auto my-auto flex w-full max-w-lg flex-col items-center justify-center py-6">
          <div className="flex w-full justify-end pb-10">
            <Suspense
              fallback={
                <span className="inline-block h-6" aria-hidden="true" />
              }
            >
              <AuthLocaleToggle />
            </Suspense>
          </div>
          <div className="w-full">
            {/* Top decorative flourish */}
            <div className="mb-10 flex justify-center">
              <FormDecorative />
            </div>

            {/* Page content: heading + form (changes per auth route) */}
            {children}

            {/* Bottom decorative flourish (flipped vertically) */}
            <div className="mt-10 flex justify-center">
              <FormDecorative className="scale-y-[-1]" />
            </div>
          </div>
        </div>

        {/* Bottom placeholder to balance top bar */}
        <div className="h-6" aria-hidden="true" />
      </section>

      {/* Right Column (Hero image) */}
      <aside className="relative hidden min-h-screen w-full overflow-hidden md:block">
        <Image
          src="/images/red-gifts.png"
          alt={t("heroImageAlt")}
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />
      </aside>
    </main>
  );
}
