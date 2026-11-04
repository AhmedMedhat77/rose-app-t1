import Image from "next/image";
import { AuthLocaleToggle } from "@/components/auth-locale-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen w-full grid-cols-1 bg-[#27262b] md:grid-cols-2">
      {/* Left Column */}
      <section className="relative flex min-h-screen flex-col justify-between px-6 py-6 sm:px-12 md:px-14 lg:px-20">
        {/* Top bar with language switcher */}
        <div className="flex w-full justify-end">
          <AuthLocaleToggle />
        </div>

        {/* Center content container */}
        <div className="my-auto flex w-full flex-col items-center justify-center py-6">
          <div className="w-full max-w-85 sm:max-w-90">
            {/* Top decorative flourish */}
            <div className="mb-4 flex justify-center">
              <Image
                src="/images/separator-1.png"
                alt="decorative separator"
                width={260}
                height={42}
                className="h-auto w-60 object-contain sm:w-65"
                priority
              />
            </div>

            {/* Page content: heading + form (changes per auth route) */}
            {children}

            {/* Bottom decorative flourish (flipped vertically) */}
            <div className="mt-6 flex justify-center">
              <Image
                src="/images/separator-1.png"
                alt="decorative separator"
                width={260}
                height={42}
                className="h-auto w-60 scale-y-[-1] object-contain sm:w-65"
              />
            </div>
          </div>
        </div>

        {/* Bottom placeholder to balance top bar */}
        <div className="h-6" aria-hidden="true" />
      </section>

      {/* Right Column (Hero image) */}
      <aside className="relative hidden h-full min-h-screen w-full overflow-hidden md:block">
        <Image
          src="/images/red-gifts.png"
          alt="Gift boxes with ribbons"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />
      </aside>
    </main>
  );
}
