import { LocaleSwitcher } from "@/shared/components/locale-switcher";
import { ThemeMode } from "@/shared/components/theme-mode";
import Footer from "@/shared/layout/Footer";
import { Header } from "@/shared/layout/Header";

export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  return (
    <main className="flex-1">
      <header className="flex flex-wrap items-center justify-between">
        <LocaleSwitcher />
        <ThemeMode />
      </header>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </main>
  );
}
