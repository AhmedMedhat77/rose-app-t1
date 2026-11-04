import FormDecorative from "@/features/auth/components/shared/form-decorative";
import { AuthLocaleToggle } from "@/shared/auth-locale-toggle";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

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
        {/* Top bar with language switcher */}

        {/* Center content container */}
        <div className="my-auto flex w-full flex-col items-center justify-center py-6">
          <div className="mb-4 flex w-full justify-start">
            <AuthLocaleToggle />
          </div>
          <div className="w-full max-w-85 sm:max-w-90">
            {/* Top decorative flourish */}
            <div className="mb-4 flex justify-center">
              <FormDecorative />
            </div>

            {/* Page content: heading + form (changes per auth route) */}
            {children}

            {/* Bottom decorative flourish (flipped vertically) */}
            <div className="mt-6 flex justify-center">
              <FormDecorative className="scale-y-[-1]" />
            </div>
          </div>
        </div>

        {/* Bottom placeholder to balance top bar */}
        <div className="h-6" aria-hidden="true" />
      </section>

      {/* Right Column (Hero image) */}
      <aside className="relative hidden h-screen w-full overflow-hidden md:block">
        <Image
          src="/images/red-gifts.png"
          alt={t("heroImageAlt")}
          fill
          priority
          sizes="50vw"
          className="object-center"
        />
      </aside>
    </main>
  );
}
